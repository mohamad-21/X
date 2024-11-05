"use client";

import {
  bookmarkTwitt,
  deleteTwitt,
  follow,
  increaseTwittView,
  likeTwitt,
  pinTwittToProfile,
  removePostRetwitt,
  retwittPost,
  unBookmarkTwitt,
  unFollow,
  unpinTwittFromProfile,
} from "@/app/_lib/actions";
import {
  ITwitt,
  UserData,
  UserFollowingsAndFollowers,
} from "@/app/_lib/definitions";
import Alert from "@/app/_ui/Alert";
import CreatePost from "@/app/_ui/createPost/CreatePost";
import DeleteConfirm from "@/app/_ui/DeleteConfirm";
import FollowButton from "@/app/_ui/FollowButton";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { ActionTypes } from "@/app/_ui/Twitt";
import TwittActions from "@/app/_ui/TwittActions";
import TwittSettings from "@/app/_ui/TwittSettings";
import { optimizedText } from "@/app/_utils/optimizedText";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState, useTransition } from "react";
import useSWR, { useSWRConfig } from "swr";

const numeral = require("numeral");

function Twitt({
  data: initialTwitt,
  user: initialUser,
}: {
  data: ITwitt & { follows: UserFollowingsAndFollowers };
  user: UserData;
}) {
  const [twitt, setTwitt] = useState(initialTwitt);
  const [user, setUser] = useState(initialUser);
  const [isMounted, setIsMounted] = useState(false);
  const [isActionOccurrs, setIsActionOccurrs] = useState(false);
  const [imageSize, setSmageSize] = useState({
    width: 1,
    height: 1,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { update } = useSession();
  const { data: updatedTwitt } = useSWR<ITwitt & { follows: UserFollowingsAndFollowers }>(
    `/api/twitt`,
    async () => {
      const resp = await fetch(`/api/twitts/${initialTwitt.id}`);
      const data: ITwitt & { follows: UserFollowingsAndFollowers } = await resp.json();
      return data;
    },
    {
      refreshInterval: 10000,
    }
  );
  const { data: updatedUserDetails } = useSWR<UserData>('/api/user/info', async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/info?id=${user.id}`);
    const data = await resp.json();
    return data;
  }, {
    refreshInterval: 10000,
    revalidateOnMount: false,
  });

  async function handleIncreaseView() {
    if (twitt.views.some(view => view == user.id)) return;
    setTwitt((prev) => ({
      ...prev,
      views: [...prev.views, user.id],
    }));
    await increaseTwittView(twitt.id, user.id!);
  }

  async function handleTwittLike() {
    setIsActionOccurrs(true);
    const likeType = twitt.likes.some((like) => like == user.id!)
      ? ActionTypes.UNLIKE_TWITT
      : ActionTypes.LIKE_TWITT;
    setTwitt(state => ({ ...state, likes: likeType == ActionTypes.LIKE_TWITT ? [...state.likes, user.id] : state.likes.filter((like) => like != user.id) }));

    await likeTwitt({ twitt, user_id: user.id });
    mutate('/api/twitt');
    setIsActionOccurrs(false);
  }

  async function handleRetwitt() {
    setIsActionOccurrs(true);
    const isAlreadyRetwitted = twitt.retwitts.some(retwitt => retwitt == user.id);
    setTwitt(state => ({ ...state, retwitts: isAlreadyRetwitted ? state.retwitts.filter(retwitt => retwitt != user.id) : [...state.retwitts, user.id] }));
    if (isAlreadyRetwitted) {
      await removePostRetwitt({ twitt_id: twitt.id, user_id: user.id });
    } else {
      await retwittPost({ twitt_id: twitt.id, user_id: user.id });
    }
    mutate('/api/twitt');
    setTimeout(() => {
      setIsActionOccurrs(false);
    }, 1500);
  }

  async function handleBookmark() {
    setIsActionOccurrs?.(true);
    const hasAlreadyBookmarked = user.bookmarks.some(bookmark => bookmark.id == twitt.id);

    if (hasAlreadyBookmarked) {
      setUser?.(state => ({ ...state, bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== twitt.id) }));
      await unBookmarkTwitt({ user_id: user.id, twitt_id: twitt.id });
    } else {
      setUser?.(state => ({ ...state, bookmarks: [...state.bookmarks, twitt] }));
      await bookmarkTwitt({ user_id: user.id, twitt_id: twitt.id });
    }
    mutate('/api/user/info');
    setTimeout(() => {
      setIsActionOccurrs?.(false);
    }, 10000);
  }

  async function hanldeFollow() {
    setTimeout(() => {
      setTwitt(prev => ({ ...prev, follows: { ...prev.follows, followers: [...prev.follows.followers, user.id as number] } }));
    }, 600);
    update('trigger');
    await follow(user.id, twitt.user_id);
  }

  async function hanldeUnfollow() {
    setTimeout(() => {
      setTwitt(prev => ({ ...prev, follows: { ...prev.follows, followers: prev.follows.followers.filter(follower => follower != user.id) } }));
    }, 600);
    update('trigger');
    await unFollow(user.id, twitt.user_id);
  }

  async function handleMenuAction(key: Key) {
    setMessage("");
    if (key === "delete") {
      setShowDeleteConfirm(true);
    } else if (key === 'pin') {
      setMessage("Post pinned on your profile");
      await pinTwittToProfile({ twitt_id: twitt.id, user_id: user.id });
    } else if (key === 'unpin') {
      setMessage("Post Unpinned from your profile");
      await unpinTwittFromProfile(twitt.id);
    } else {
      setMessage("This action is not available for now.");
    }
  }

  async function handleTwittDelete() {
    startTransition(async () => {
      await deleteTwitt(twitt.id);
      router.replace("/home");
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 5000);
    document.documentElement.scrollTop = 0;
    if (!twitt.views.includes(user.id as number)) {
      handleIncreaseView();
    }
  }, []);

  useEffect(() => {
    setTwitt(initialTwitt);
  }, [initialTwitt]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isActionOccurrs && updatedTwitt) {
      setTwitt(updatedTwitt);
    }
  }, [updatedTwitt, isActionOccurrs, isMounted]);

  useEffect(() => {
    if (!isActionOccurrs && updatedUserDetails) {
      setUser(updatedUserDetails);
    }
  }, [updatedUserDetails, isActionOccurrs]);

  return (
    <>
      <div className="flex flex-col gap-3 px-4 border-b border-b-default pb-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <Link href={`/${twitt.username}`} className="w-[45px] h-[45px]">
                <img
                  width={45}
                  height={45}
                  className="w-[45px] h-[45px] rounded-full flex-shrink-0 object-cover"
                  src={twitt.user_profile}
                  alt={twitt.name!}
                />
              </Link>
              <div>
                <Link href={`/${twitt.username}`} className="font-bold leading-5 block text-foreground">{twitt.name}</Link>
                <Link href={`/${twitt.username}`} className="text-default-400 text-[15px] block">
                  @{twitt.username}
                </Link>
              </div>
            </div>
            <TwittSettings
              twitt={twitt}
              user={user}
              onMenuAction={handleMenuAction}
            />
          </div>
          <div>
            {twitt.user_id != user.id && (
              <FollowButton isFollowing={twitt.follows.followers.some(follower => follower == user.id)} onFollow={hanldeFollow} onUnfollow={hanldeUnfollow} />
            )}
          </div>
        </div>

        {twitt.text && (
          <p
            className="whitespace-pre-wrap leading-5 break-words to-twitt text-lg"
            dir={/[\u0600-\u06FF]/.test(twitt.text) ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{ __html: optimizedText(twitt.text) }}
          />
        )}
        {twitt.media && ["image", "gif"].includes(twitt.media_type ?? "") && (
          <div className="to-twitt mt-4">
            {twitt.media_type === 'gif' ? (
              <img
                src={twitt.media}
                alt={twitt.text}
                className={`${imageSize.width ? "" : "hidden"} to-twitt object-cover rounded-2xl border border-default mx-auto block`}
                onLoad={(target) => {
                  setSmageSize({
                    width: target.currentTarget.naturalWidth,
                    height: target.currentTarget.naturalHeight,
                  });
                }}
                width={imageSize.width}
                height={imageSize.height}
              />

            ) : (
              <img
                src={twitt.media}
                alt={twitt.text}
                className={`${imageSize.width ? "" : "hidden"} to-twitt object-cover rounded-2xl border border-default mx-auto block`}
                onLoad={(target) => {
                  setSmageSize({
                    width: target.currentTarget.naturalWidth,
                    height: target.currentTarget.naturalHeight,
                  });
                }}
                width={imageSize.width}
                height={imageSize.height}
              />
            )}
            {!imageSize.width && (
              <div className="w-full h-[300px] flex items-center justify-center to-twitt border border-default rounded-2xl">
                <LoadingSpinner noPadding />
              </div>
            )}
          </div>
        )}
        {twitt.media && twitt.media_type === "video" && (
          <MediaPlayer src={twitt.media} className="mt-4 border border-default">
            <MediaProvider />
            <DefaultVideoLayout icons={defaultLayoutIcons} />
          </MediaPlayer>
        )}
        <ul className="flex items-center text-default-400">
          <li>{format(twitt.created_at, "p")}</li>
          <span className="px-1">-</span>
          <li>{format(twitt.created_at, "PP")}</li>
          <span className="px-1">-</span>
          <li>
            <span className="text-foreground">
              {numeral(twitt.views.length).format("0a")}
            </span>{" "}
            Views
          </li>
        </ul>
        <TwittActions
          twitt={twitt}
          user={user}
          onCommentsClick={() => {
            router.push(`/post?replyto=${twitt.id}`);
          }}
          onBookmark={handleBookmark}
          onRetwitt={handleRetwitt}
          onLike={handleTwittLike}
          className="border-y border-y-default py-2"
        />
        <div className="mt-2">
          <CreatePost
            type="reply"
            noPadding
            user={user}
            rows={1}
            showOnClick
            initialReplyTo={twitt}
          />
        </div>
        {message && <Alert type="fixed">{message}</Alert>}
      </div>
      {showDeleteConfirm && (
        <DeleteConfirm
          desc="This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. "
          action={handleTwittDelete}
          pending={pending}
        >
          Delete Post?
        </DeleteConfirm>
      )}
    </>
  );
}

export default Twitt;
