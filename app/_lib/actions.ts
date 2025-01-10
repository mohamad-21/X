"use server";

import bcrypt from "bcryptjs";
import { ResultSetHeader } from "mysql2";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { query } from "./db";
import {
  ActionError,
  AddTwitt,
  INotification,
  ITwitt,
  PasswordData,
  SessionUser,
  SignupData,
  User,
  UserFollowingsAndFollowers,
  UserFollowingsAndFollowersTable,
  UserData,
  Verification,
} from "./definitions";
import { sendMail } from "./sendMail";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

interface CredentialsData extends SignupData, PasswordData { }

interface OAuthData {
  name: string;
  email: string;
  image: string;
  password: null;
}

export async function getAlltwitts({
  byUsername = false,
  username,
  with_reply = false,
  includeRetwitts = false
}: {
  byUsername?: boolean;
  username?: string;
  with_reply?: boolean;
  includeRetwitts?: boolean;
} = {}): Promise<ITwitt[]> {
  let condition = `${byUsername && username ? "where users.username = ?" : ""
    } ${!with_reply ? "and reply_to is null" : ""}`;
  const params: any[] = [];
  let retwitts: ITwitt[] = [];

  if (byUsername) {
    params.push(username);
    const [user] = await query<{ id: number }[]>(
      "select id from users where username = ?",
      [username]
    );
    if (includeRetwitts) {
      const userRetwitts = await query<
        { id: number; twitt_id: number; user_id: number; created_at: Date }[]
      >("select * from retwitts where user_id = ?", [user.id]);
      if (userRetwitts.length) {
        const twittIds = userRetwitts.map((twitt) => twitt.twitt_id);
        retwitts = await getTwittsByIds(twittIds);
        retwitts = retwitts.map((retwitt, idx) => {
          retwitt.created_at = userRetwitts[idx].created_at;
          return retwitt;
        });
      }
    }
  }

  const allTwitts = await query<ITwitt[]>(
    `select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.comments, twitts.retwitts, twitts.is_pinned, users.id as user_id, users.username, users.name, users.profile as user_profile, users.account_type from twitts join users on twitts.user_id = users.id ${condition} order by twitts.id desc`,
    params
  );

  if (retwitts.length) {
    return [...allTwitts, ...retwitts].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime()
    );
  }

  return allTwitts;
}

export async function getTwittsBySearch(searchTerm: string) {
  const twitts = await query<ITwitt[]>(
    "select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.comments, twitts.retwitts, twitts.is_pinned, users.id as user_id, users.username, users.name, users.profile as user_profile from twitts join users on twitts.user_id = users.id where lower(text) like ? and twitts.reply_to is null order by twitts.id desc",
    [`%${searchTerm.toLowerCase()}%`]
  );
  return twitts;
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}

export async function getTwittById(
  id: number | string
): Promise<ITwitt | null> {
  const [twitt] = await query<ITwitt[]>(
    "select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.comments, twitts.retwitts, twitts.is_pinned, users.id as user_id, users.username, users.name, users.profile as user_profile, users.account_type from twitts join users on twitts.user_id = users.id where twitts.id = ? order by twitts.id desc",
    [id]
  );
  if (!twitt) return null;

  return twitt;
}

export async function getTwittsByIds(ids: (number | string)[]) {
  const idsQuery = ids.map(() => "?").join(",");
  const twitts = await query<ITwitt[]>(
    `select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.comments, twitts.retwitts, twitts.is_pinned, users.id as user_id, users.username, users.name, users.profile as user_profile, users.account_type from twitts join users on twitts.user_id = users.id where twitts.id in(${idsQuery}) order by twitts.id desc`,
    ids
  );

  twitts.map((twitt) => (twitt.isRetwitt = true));

  return twitts;
}

export async function getTwittComments(twitt_id: number | string) {
  const comments = await query<ITwitt[]>(
    "select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.retwitts, twitts.comments, twitts.is_pinned, users.id as user_id, users.username, users.name, users.profile as user_profile, users.account_type from twitts join users on twitts.user_id = users.id where twitts.reply_to = ? order by twitts.id desc",
    [twitt_id]
  );

  return comments;
}

export async function getUserDetailsById(id: number | string) {
  const [user] = await query<User[]>(
    "select * from users where id = ? or username = ?",
    [id, id]
  );
  if (!user) return;
  const follows = await getUserFollowersAndFollowings(user.id);
  return {
    ...user,
    follows,
  };
}

export async function getUserDataById(
  id: number | string,
  {
    twittsWithReply,
    mediaOnly,
    includeRetwitts
  }: {
    twittsWithReply?: boolean;
    mediaOnly?: boolean;
    includeRetwitts?: boolean
  } = {}
) {
  const [user] = await query<User[]>(
    "select * from users where id = ? or username = ?",
    [id, id]
  );
  if (!user) return;
  const follows = await getUserFollowersAndFollowings(user.id);
  const [userTwitts, bookmarks] = await Promise.all([
    mediaOnly
      ? getUserTwittsByMedia(id)
      : getAlltwitts({
        byUsername: true,
        username: user.username,
        with_reply: twittsWithReply,
        includeRetwitts
      }),
    getUserBookmarks(user.id),
  ]);
  return {
    ...user,
    twitts: userTwitts,
    follows,
    bookmarks,
  };
}

export async function getUserDetailsFromAPI(
  id: number | string,
  {
    twittsWithReply,
    mediaOnly,
    onlyDetails,
  }: {
    twittsWithReply?: boolean;
    mediaOnly?: boolean;
    onlyDetails?: boolean;
  } = {}
) {
  let twittsType = "";
  if (twittsWithReply) {
    twittsType = "with_reply";
  }
  if (mediaOnly) {
    twittsType = "media_only";
  }
  const resp = await fetch(
    `${process.env.AUTH_URL}/api/user/info?id=${id}${twittsType ? `&twitts_type=${twittsType}` : ""
    }${onlyDetails ? "&full_data=false" : ""}`
  );

  if (onlyDetails) {
    const data: Omit<UserData, "twitts" | "bookmarks"> = await resp.json();
    return data;
  }
  const data: UserData = await resp.json();
  return data;
}

export async function pinTwittToProfile({
  twitt_id,
  user_id,
}: {
  twitt_id: number | string;
  user_id: number | string;
}) {
  await Promise.all([
    query("update twitts set is_pinned = 0 where user_id = ?", [user_id]),
    query("update twitts set is_pinned = 1 where id = ?", [twitt_id]),
  ]);
}

export async function unpinTwittFromProfile(twitt_id: number | string) {
  await query("update twitts set is_pinned = 0 where id = ?", [twitt_id]);
}

export async function getUserFollowersAndFollowings(user_id: number | string) {
  const result = await query<UserFollowingsAndFollowersTable[]>(
    "select * from follows where following_id = ? or follower_id = ?",
    [user_id, user_id]
  );

  if (result.length < 1)
    return {
      followers: [],
      followings: [],
    };

  const followers = result
    .filter((follow) => follow.following_id == user_id)
    .map((follow) => follow.follower_id);
  const followings = result
    .filter((follow) => follow.follower_id == user_id)
    .map((follow) => follow.following_id);
  return {
    followers: followers,
    followings: followings,
  };
}

export async function deleteTwitt(twitt_id: number | string) {
  const twitt = await query<ITwitt[]>("select * from twitts where id = ?", [
    twitt_id,
  ]);
  async function deleteComments() {
    twitt[0].comments.forEach(async (comment) => {
      await query("delete from twitts where id = ?", [comment]);
    });
  }
  if (twitt[0].reply_to) {
    const replyedtoTwitt = await query<{ comments: number[] }[]>(
      "select comments from twitts where id = ?",
      [twitt[0].reply_to]
    );
    const updatedComments = replyedtoTwitt[0].comments
      .filter((comment) => comment != twitt_id)
      .toString();
    await Promise.all([
      query("delete from twitts where id = ?", [twitt_id]),
      query("update twitts set comments = ? where id = ?", [
        `[${updatedComments}]`,
        twitt[0].reply_to,
      ]),
      twitt[0].comments.length ? deleteComments() : null,
    ]);
  } else {
    await Promise.all([
      query("delete from twitts where id = ?", [twitt_id]),
      twitt[0].comments.length ? deleteComments() : null,
    ]);
  }
  revalidatePath('/home');
  revalidatePath(`/${twitt[0].username}/status/${twitt_id}`);
}

export async function getPeopleAndTwittsBySearch(searchTerm: string) {
  const people = await query<User[]>(
    "select * from users where lower(name) like ? or lower(username) like ?",
    [`%${searchTerm.toLowerCase()}%`, `%${searchTerm.toLowerCase()}%`]
  );
  const twitts = await getTwittsBySearch(searchTerm);

  return {
    people,
    twitts,
  };
}

export async function signinWithGoogle() {
  await signIn("google", {
    redirectTo: "/home",
  });
}

export async function checkExistsEmail(email: string): Promise<boolean> {
  const result = await query<{ total_users: number }[]>(
    "select count(*) as total_users from users where email=?",
    [email]
  );
  return result[0].total_users > 0;
}

export async function sendVerification(email: string) {
  const code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2);
  const expiresToDatetime = expiresAt
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    await sendMail({
      to: email,
      replyTo: email,
      subject: `${code} is your verification code`,
      html: `<div style="width:100%;padding-top:4rem;display:grid">
            <div style="width:100%;max-width:400px; margin:0 auto">
              <h1 style="margin-bottom:14px; margin-top:27px">Confirm your email address</h1>
              <p style="margin-bottom:12px;font-size:1rem">There’s one quick step you need to complete before creating your X account. Let’s make sure this is the right email address for you — please confirm this is the right address to use for your new account.</p>
              <div style="margin-bottom:12px">
                <p style="font-size:1rem">Please enter this verification code to get started on X:</p>
                <h1>${code}</h1>
              </div>
    
              <p style="font-size:1rem">
                Verification codes expire after two hours.
              </p>
              <p style="font-size:1rem">
                Thanks,
                X
              </p>
            </div>
          </div>
        `,
    });

    const oldVerification = await query<{ total_verifications: number }[]>(
      "select count(*) as total_verifications from verifications where email=?",
      [email]
    );
    let result;
    if (oldVerification[0].total_verifications > 0) {
      result = await query("update verifications set code=?,expires_at=?", [
        code,
        expiresToDatetime,
      ]);
    } else {
      result = await query(
        "insert into verifications (email, code, expires_at) values (?, ?, ?)",
        [email, code, expiresToDatetime]
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function sendPasswordResetVerification(email: string) {
  const code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2);
  const expiresToDatetime = expiresAt
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  try {
    await sendMail({
      to: email,
      replyTo: email,
      subject: `${code} is your verification code`,
      html: `<div style="width:100%;padding-top:4rem;display:grid">
            <div style="width:100%;max-width:400px; margin:0 auto">
              <h1 style="margin-bottom:14px; margin-top:27px">Reset your password?</h1>
              <p style="margin-bottom:12px;font-size:1rem">If you requested a password reset for @Mohamadc21, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.</p>
              <div style="margin-bottom:12px">
                <h3>${code}</h3>
              </div>
    
              <div>
                <h2 style="margin-bottom: 4px;">Getting a lot of password reset emails?</h2>
                <p style="font-size:1rem">
                You can change your account settings to require personal information to reset your password.
                </p>
              </div>
            </div>
          </div>
        `,
    });

    const oldVerification = await query<{ total_verifications: number }[]>(
      "select count(*) as total_verifications from verifications where email=?",
      [email]
    );
    let result;
    if (oldVerification[0].total_verifications > 0) {
      result = await query("update verifications set code=?,expires_at=?", [
        code,
        expiresToDatetime,
      ]);
    } else {
      result = await query(
        "insert into verifications (email, code, expires_at) values (?, ?, ?)",
        [email, code, expiresToDatetime]
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function checkVerificationCode(
  email: string,
  code: string | number
): Promise<ActionError> {
  const result = await query<Verification[]>(
    "select * from verifications where email=? and code=?",
    [email, code]
  );

  if (result.length < 1) {
    const t = await getTranslations();
    return { message: t("verificationIsNotCorrect") };
  }

  const now = new Date().setHours(new Date().getHours() + 1);
  const timeDifference = Math.floor(
    (now - Date.parse(result[0].expires_at.toString())) / 1000
  );

  if (timeDifference < -7200) {
    const t = await getTranslations();
    return { message: t("verificationExpired") };
  }
}

export async function signinWithCredentials(data: {
  email_username: string;
  password: string;
}): Promise<ActionError> {
  try {
    await signIn("credentials", {
      email: data.email_username,
      password: data.password,
      redirect: false,
    });
  } catch (err: any) {
    if (err instanceof AuthError) {
      return { message: err.message };
    }
    const t = await getTranslations();
    console.error(err.message);
    return { message: t("somethingWentWrong") };
  }
}

export async function signupWithCredentials(
  data: CredentialsData
): Promise<ActionError> {
  const { name, email, password, year, month, day } = data;
  const birthDay = new Date(`${year}-${month}-${day}`)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const hashedPass = await bcrypt.hash(password, 10);
  const username =
    name.split(" ")[0] +
    Math.floor(Math.random() * (99999 - 10000 + 1)) +
    10000;
  const defaultProfile =
    "https://utfs.io/f/K02DyyEnuX6Ge6tBLFJ7Bn81ARI2iUGhuxaLX4rYT9gE5WoK";

  try {
    await query(
      "insert into users (name, email, password, username, profile, birthday) values (?,?,?,?,?, ?)",
      [name, email, hashedPass, username, defaultProfile, birthDay]
    );
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        message: err.message,
      };
    } else {
      const t = await getTranslations();
      return {
        message: t("errorOccurred"),
      };
    }
  }
}

export async function updateProfilePhoto({
  email,
  profileUrl,
}: {
  email: string;
  profileUrl: string;
}) {
  await query("update users set profile = ? where email = ?", [
    profileUrl,
    email,
  ]);
}

export async function signupWithOAuth(data: OAuthData): Promise<ActionError> {
  const { name, email, image } = data;
  const username =
    name.split(" ").join("").slice(0, 8) +
    (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
  try {
    await query(
      "insert into users (name, email, username, profile) values (?,?,?,?)",
      [name, email, username, image]
    );
    await signIn("credentials", { email, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        message: err.message,
      };
    } else {
      const t = await getTranslations();
      return {
        message: t("errorOccurred"),
      };
    }
  }
}

export async function usernameIsUnique(username: string): Promise<boolean> {
  const result = await query<{ total_usernames: number }[]>(
    "select count(*) as total_usernames from users where username=?",
    [username]
  );
  return result[0].total_usernames < 1;
}

export async function updateUsername(
  username: string,
  email: string
): Promise<ActionError> {
  try {
    const isUnqiue = await usernameIsUnique(username);
    if (!isUnqiue)
      return {
        message: "Username already has been taken. choose something different",
      };
    await query("update users set username=? where email=?", [username, email]);
  } catch (err) {
    const t = await getTranslations();
    return {
      message: t("errorOccurred"),
    };
  }
}

export async function checkExistsUserByEmailUsername(
  value: string,
  giveEmail: boolean = false
): Promise<any> {
  const res = await query<{ email: string }[]>(
    "select email from users where email = ? or username = ?",
    [value, value]
  );
  if (giveEmail) {
    return {
      exists: Boolean(res.length > 0),
      email: res.length > 0 ? res[0].email : null,
    };
  }
  return res.length > 0;
}

export async function changePassword(
  email: string,
  password: string
): Promise<ActionError> {
  const hashedPass = await bcrypt.hash(password, 10);
  try {
    await query("update users set password = ? where email = ?", [
      hashedPass,
      email,
    ]);
  } catch (err) {
    const t = await getTranslations();
    return {
      message: t("errorOccurred"),
    };
  }
}

export async function addTwitt({
  userId,
  text,
  formData,
  gif,
  replyTo,
}: AddTwitt): Promise<{ insertId?: number; error: ActionError }> {
  let fields = "user_id, text, comments, likes, retwitts, views";
  let values = "?,?,?,?,?,?";
  let params = [userId, text, "[]", "[]", "[]", `["${userId}"]`];

  if (formData?.get("mediaUrl") && formData?.get("mediaType")) {
    const mediaUrl = formData.get("mediaUrl") as string;
    const mediaType = formData.get("mediaType") as string;
    fields += ", media, media_type";
    values += ",?,?";
    params.push(mediaUrl, mediaType.split("/")[0]);
  }

  if (gif) {
    fields += ", media, media_type";
    values += ",?, ?";
    params.push(gif, "gif");
  }

  if (replyTo) {
    fields += ", reply_to";
    values += ",?";
    params.push(replyTo);
  }

  try {
    const result = await query<ResultSetHeader>(
      `insert into twitts (${fields}) values (${values})`,
      params
    );
    if (replyTo) {
      const replyedtoTwitt = await query<{ user_id: number, username: string }[]>(
        "select user_id, username from twitts where id = ?",
        [replyTo]
      );
      await Promise.all([
        query(
          "update twitts set comments = json_array_append(comments, '$', ?) where id = ?",
          [result.insertId.toString(), replyTo]
        ),
        pushNotification({
          user_id: replyedtoTwitt[0].user_id as number,
          opposite_id: userId as number,
          type: "reply",
          place_id: result.insertId,
          text,
        }),
      ]);
      revalidatePath(`/${replyedtoTwitt[0].username}/status/${replyTo}`);
    }
    revalidatePath('/home');
    return { insertId: result.insertId, error: undefined };
  } catch (err) {
    console.error(err);
    return { error: { message: "an error occurred" } };
  }
}

export async function increaseTwittView(
  twitt_id: number | string,
  user_id: number | string
) {
  const result = await query<{ views: number[] }[]>(
    "select views from twitts where id = ?",
    [twitt_id]
  );

  if (result.length < 1) return;

  const views = result[0].views;

  const alreadyViewed = views.some((view) => view == user_id);

  if (alreadyViewed) return;

  await query(
    "update twitts set views = json_array_append(views, '$', ?) where id = ?",
    [`${user_id}`, twitt_id]
  );
}

export async function likeTwitt({
  twitt,
  user_id,
}: {
  twitt: ITwitt;
  user_id: number | string;
}) {
  const result = await query<{ likes: number[] }[]>(
    "select likes from twitts where id = ? and json_contains(likes, ?)",
    [twitt.id, `"${user_id}"`]
  );

  if (!result.length) {
    await Promise.all([
      await query(
        "update twitts set likes = json_array_append(likes, '$', ?) where id = ?",
        [`${user_id}`, twitt.id]
      ),
      pushNotification({
        user_id: twitt.user_id as number,
        opposite_id: user_id as number,
        type: "like",
        place_id: twitt.id,
      }),
    ]);
  } else {
    const likes = twitt.likes.filter((like) => like != user_id).toString();
    await query("update twitts set likes = ? where id = ?", [
      `[${likes}]`,
      twitt.id,
    ]);
  }
}

export async function follow(
  follower_id: number | string,
  following_id: number | string
) {
  const exists = await query<{ id: number }[]>(
    "select id from follows where follower_id = ? and following_id = ?",
    [follower_id, following_id]
  );
  if (exists.length > 0) return;

  await Promise.all([
    query("insert into follows (follower_id, following_id) values (?,?)", [
      follower_id,
      following_id,
    ]),
    pushNotification({
      user_id: following_id as number,
      opposite_id: follower_id as number,
      type: "follow",
    }),
  ]);
}

export async function unFollow(
  follower_id: number | string,
  following_id: number | string
) {
  await query(
    "delete from follows where follower_id = ? and following_id = ?",
    [follower_id, following_id]
  );
}

export async function updateUserInfo(formData: FormData): Promise<ActionError> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const bio = formData.get("bio") as string;
  const website = formData.get("website") as string;
  const location = formData.get("location") as string;
  const header_photo_url = formData.get("header_photo") as string;
  const profile_photo_url = formData.get("profile_photo") as string;

  let fields = "name=?, bio=?, website=?, location=?";
  const params = [name, bio, website, location];

  if (profile_photo_url) {
    fields += ", profile=?";
    params.push(profile_photo_url);
  }

  if (header_photo_url) {
    fields += ", header_photo=?";
    params.push(header_photo_url);
  }

  try {
    await query(`update users set ${fields} where email = ?`, [
      ...params,
      email,
    ]);
    revalidatePath("/", "layout");
  } catch (err) {
    const t = await getTranslations();
    console.error(err);
    return { message: t("errorOccurred") };
  }
}

export async function getUserTwittsByMedia(user_id: number | string) {
  const twitts = await query<ITwitt[]>(
    `select twitts.id, twitts.text, twitts.media, twitts.created_at, twitts.media_type, twitts.likes, twitts.views, twitts.reply_to, twitts.comments, twitts.retwitts, users.id as user_id, users.username, users.name, users.profile as user_profile, users.account_type from twitts join users on twitts.user_id = users.id where (users.id = ? or users.username = ?) and not (twitts.media is null) order by twitts.id desc`,
    [user_id, user_id]
  );
  return twitts;
}

export async function getUserNotifications(user_id: number | string) {
  const notifications = await query<INotification[]>(
    "select notifications.user_id, notifications.opposite_id, notifications.type, notifications.place_id, notifications.text, notifications.is_viewed, users.profile, users.name, users.username, users.account_type from notifications join users on notifications.opposite_id = users.id where user_id = ? order by notifications.id desc",
    [user_id]
  );
  return notifications;
}

export async function readNotifications({ user }: { user?: SessionUser }) {
  let userSession = user;
  if (!user) {
    const session = await auth();
    if (!session) return;
    userSession = session.user;
  }
  if (!userSession) return;
  const result = await query<{ total_notifs: number }[]>(
    "select count(id) as total_notifs from notifications"
  );
  if (result[0].total_notifs > 7) {
    await query("delete from notifications order by id desc limit 1");
  }
  await query(`update notifications set is_viewed=1 where user_id = ?`, [
    userSession.id,
  ]);
}

export async function pushNotification({
  user_id,
  opposite_id,
  type,
  place_id,
  text,
}: {
  user_id: number;
  opposite_id: number;
  type?: "follow" | "like" | "reply";
  place_id?: number;
  text?: string;
}) {
  if (user_id != opposite_id) {
    await query(
      "insert into notifications(user_id, opposite_id, type, place_id, text) values(?,?,?,?,?)",
      [
        user_id,
        opposite_id || null,
        type || null,
        place_id || null,
        text || null,
      ]
    );
  }
}

export async function retwittPost({
  user_id,
  twitt_id,
}: {
  user_id: number | string;
  twitt_id: number | string;
}) {
  await Promise.all([
    await query("insert into retwitts(user_id, twitt_id) values(?,?)", [
      user_id,
      twitt_id,
    ]),
    await query(
      "update twitts set retwitts = json_array_append(retwitts, '$', ?) where id = ?",
      [`${user_id}`, twitt_id]
    ),
  ]);
}

export async function removePostRetwitt({
  user_id,
  twitt_id,
}: {
  user_id: number | string;
  twitt_id: number | string;
}) {
  const retwittPost = await getTwittById(twitt_id);
  const updatedPostRetwitts = retwittPost?.retwitts
    .filter((retwitt) => retwitt != user_id)
    .toString();
  await Promise.all([
    await query("delete from retwitts where user_id = ? and twitt_id = ?", [
      user_id,
      twitt_id,
    ]),
    await query("update twitts set retwitts = ? where id = ?", [
      `[${updatedPostRetwitts}]`,
      twitt_id,
    ]),
  ]);
}

export async function getUserBookmarks(user_id: number | string) {
  const bookmarks = await query<
    { id: number; user_id: number; twitt_id: number }[]
  >("select * from bookmarks where user_id = ?", [user_id]);

  if (bookmarks.length < 1) {
    return [];
  }

  const bookmarkIds = bookmarks.map((bookmark) => bookmark.twitt_id);
  const bookmarkedTwitts = await getTwittsByIds(bookmarkIds);

  return bookmarkedTwitts;
}

export async function bookmarkTwitt({
  user_id,
  twitt_id,
}: {
  user_id: number | string;
  twitt_id: number | string;
}) {
  await query("insert into bookmarks(user_id, twitt_id) values(?, ?)", [
    user_id,
    twitt_id,
  ]);
}

export async function unBookmarkTwitt({
  user_id,
  twitt_id,
}: {
  user_id: number | string;
  twitt_id: number | string;
}) {
  await query("delete from bookmarks where user_id = ? and twitt_id = ?", [
    user_id,
    twitt_id,
  ]);
}

export async function getWhoToFollowSuggestings(user_id: number | string) {
  const peopleWhoHasInUserFollows = await getUserFollowersAndFollowings(
    user_id
  );
  if (
    peopleWhoHasInUserFollows.followers.length < 1 &&
    peopleWhoHasInUserFollows.followings.length < 1
  ) {
    const newPeopleToUser = await query<User[]>(
      "select * from users where not id in(?)",
      [`${user_id}`]
    );
    return newPeopleToUser;
  }
  const existsIds = [
    ...peopleWhoHasInUserFollows.followers,
    ...peopleWhoHasInUserFollows.followings,
  ].filter((id) => id != user_id);
  const newPeopleToUser = await query<User[]>(
    `select * from users where not id in(${existsIds
      .map(() => "?")
      .toString()}, ?)`,
    [...existsIds, user_id]
  );
  return newPeopleToUser;
}

export async function changeLanguage(lang: string) {
  cookies().set({ name: "lang", value: lang, httpOnly: true });
}

export async function upgradeAccount({ userId, type }: { userId: string | number, type: "basic" | "premium" | "premium_plus" }) {
  await query("update users set account_type = ? where id = ?", [
    type, userId
  ]);
}