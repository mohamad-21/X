import {
  getTwittsByIds,
  getUserNotifications,
  readNotifications,
} from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import Notifications from "./Notifications";
import { getTranslations } from "next-intl/server";

async function NotificationsWrapper() {
  const session = await auth();
  if (!session) return;
  let [userNotifications, _, t] = await Promise.all([
    getUserNotifications(session.user.id),
    readNotifications({ user: session.user }),
    getTranslations(),
  ]);

  const placeIds = userNotifications
    .filter((notif) => notif.type === "like" && notif.place_id)
    .map((notif) => notif.place_id);

  if (placeIds.length) {
    const twittsData = await getTwittsByIds(placeIds as (number | string)[]);

    userNotifications = userNotifications.map((notif) => {
      if (notif.type === "like" && notif.place_id) {
        notif.twitt = twittsData.find((tweet) => tweet.id === notif.place_id);
      }
      return notif;
    });
  }

  if (userNotifications.length < 1) {
    return (
      <div className="mx-auto max-w-md px-5 py-10">
        <h1 className="text-4xl mb-1 font-bold">{t("nothingToSeeHere")}</h1>
        <p className="text-default-400">{t("notificationsNotFoundMessage")}</p>
      </div>
    );
  }

  return (
    <ul>
      {userNotifications.map((notif) => (
        <li key={notif.id}>
          <Notifications notif={notif} user={session.user} />
        </li>
      ))}
    </ul>
  );
}

export default NotificationsWrapper;
