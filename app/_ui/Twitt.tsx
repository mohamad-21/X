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
import { ITwitt, UserData } from "@/app/_lib/definitions";
import { useIsVisible } from "@/app/_lib/hooks";
import { optimizedText } from "@/app/_utils/optimizedText";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  Key,
  useEffect,
  useRef,
  useState,
  useTransition
} from "react";
import { LuRepeat2 } from "react-icons/lu";
import { MdOutlinePushPin } from "react-icons/md";
import { useSWRConfig } from "swr";
import { useMutateAll } from "../_lib/swr";
import Alert from "./Alert";
import DeleteConfirm from "./DeleteConfirm";
import LoadingSpinner from "./LoadingSpinner";
import TwittActions from "./TwittActions";
import TwittSettings from "./TwittSettings";

export const ActionTypes = {
  INCREASE_VIEW: "INCREASE_VIEW",
  LIKE_TWITT: "LIKE_TWITT",
  UNLIKE_TWITT: "UNLIKE_TWITT",
};

type TwittProps = {
  twitt: ITwitt;
  user: UserData;
  setTwitts: React.Dispatch<React.SetStateAction<ITwitt[]>>;
  twitts: ITwitt[];
  setIsActionOccurrs?: React.Dispatch<React.SetStateAction<boolean>>;
  mediaOnly?: boolean;
  isUserTwitts?: boolean;
  isRetwittAndInUserTwitts?: boolean;
  setUser?: React.Dispatch<React.SetStateAction<UserData>>;
  isBookmarksList?: boolean
};

function Twitt({
  twitt,
  user,
  setTwitts,
  twitts,
  setIsActionOccurrs,
  mediaOnly,
  isUserTwitts,
  isRetwittAndInUserTwitts,
  setUser,
  isBookmarksList
}: TwittProps) {
  const [imageSize, setSmageSize] = useState({
    width: 0,
    height: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const twittRef = useRef(null);
  const isVisible = useIsVisible(twittRef);
  const [hide, setHide] = useState(false);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const mutateAll = useMutateAll();
  const [pending, startTransition] = useTransition();

  async function handleIncreaseView() {
    setTwitts(twitts.map(state => {
      if (state.id == twitt.id) {
        return {
          ...state,
          views: [...state.views, user.id]
        }
      }
      return state;
    }))
    await increaseTwittView(twitt.id, user.id!);
  }

  async function handleTwittLike() {
    setIsActionOccurrs?.(true);
    const likeType = twitt.likes.some((like) => like == user.id!)
      ? ActionTypes.UNLIKE_TWITT
      : ActionTypes.LIKE_TWITT;
    setTwitts(twitts.map((state) => {
      if (twitt.id === state.id) {
        state = {
          ...state,
          likes: likeType == ActionTypes.LIKE_TWITT ? [...state.likes, user.id!] : state.likes.filter((like) => like != user.id!),
        };
      }
      return state;
    }));
    await likeTwitt({ twitt, user_id: user.id! });
    mutate('/api/twitts');
    mutate('/api/twitts/comments');
    mutate('/api/user/twitts');
    setTimeout(() => {
      setIsActionOccurrs?.(false);
    }, 7000);
  }

  async function handleRetwitt() {
    setIsActionOccurrs?.(true);
    const isAlreadyRetwitted = twitt.retwitts.some(retwitt => retwitt == user.id);
    setTwitts(prev => prev.map(state => {
      if (state.id === twitt.id) {
        state = {
          ...state,
          retwitts: isAlreadyRetwitted ? state.retwitts.filter(retwitt => retwitt != user.id) : [...state.retwitts, user.id]
        };
      }
      return state;
    }));
    if (isAlreadyRetwitted && isRetwittAndInUserTwitts) {
      setHide(true);
    }
    if (isAlreadyRetwitted) {
      await removePostRetwitt({ twitt_id: twitt.id, user_id: user.id });
    } else {
      await retwittPost({ twitt_id: twitt.id, user_id: user.id });
    }
    mutate('/api/twitts');
    mutate('/api/twitts/comments');
    mutate('/api/user/twitts');
    setTimeout(() => {
      setIsActionOccurrs?.(false);
    }, 7000);
  }

  async function handleBookmark() {
    setIsActionOccurrs?.(true);
    const hasAlreadyBookmarked = user.bookmarks.some(bookmark => bookmark.id == twitt.id);

    if (hasAlreadyBookmarked) {
      setUser?.(state => ({ ...state, bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== twitt.id) }));
      if (isBookmarksList) {
        setHide(true);
      }
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

  function handleTwittClick(e: React.MouseEvent<any>) {
    const targetClassList = (e.target as Element).classList;
    if (targetClassList.contains("to-twitt")) {
      router.push(`/${twitt.username}/status/${twitt.id}`, { scroll: false });
    }
  }

  async function handleMenuAction(key: Key) {
    setMessage("");
    if (key === "delete") {
      setShowDeleteConfirm(true);
    } else if (key === "follow") {
      await follow(user.id, twitt.user_id);
      mutate('/api/user/info');
      setMessage(`You're now following @${twitt.username}`);
    } else if (key === "unfollow") {
      await unFollow(user.id, twitt.user_id);
      mutate('/api/user/info');
      setMessage(`@${twitt.username} now is not in your followings`);
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
      setTwitts((prev) => prev.filter((t) => t.id !== twitt.id));
      setShowDeleteConfirm(false);
    });
    mutateAll();
  }

  useEffect(() => {
    if (!isVisible) return;

    const alreadyViewed = twitt.views.some((view) => view == user.id!);

    if (!alreadyViewed) {
      handleIncreaseView();
    }
  }, [isVisible]);

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  if (hide) return null;

  return (
    <div
      ref={twittRef}
      className={`${mediaOnly ? "" : "border-b border-default px-4 py-3"
        } bg-transparent hover:bg-default/15 transition cursor-pointer to-twitt w-full`}
      onClick={handleTwittClick}
    >
      {mediaOnly ? (
        <Link href={`/${user.username}/status/${twitt.id}`} className="w-full h-full">
          <img
            src={twitt.media!}
            className="w-full object-cover aspect-square"
            alt={twitt.text}
          />
        </Link>
      ) : (
        <>
          {isUserTwitts && (
            <>
              {twitt.is_pinned === 1 && (
                <p className="inline-flex items-center text-default-400 text-xs mb-2 gap-0.5 ml-5 font-bold"><MdOutlinePushPin size={16} /> Pinned</p>
              )}
              {isRetwittAndInUserTwitts && (
                <p className="inline-flex items-center text-default-400 text-xs mb-2 gap-0.5 ml-5 font-bold"><LuRepeat2 size={16} /> {user.name} Reposted</p>
              )}
            </>
          )}
          <div
            className="grid gap-4 to-twitt"
            style={{ gridTemplateColumns: "45px 1fr" }}
          >
            <Link href={`/${twitt.username}`} className="w-[45px] h-[45px] flex-shrink-0">
              <img
                className="w-[45px] h-[45px] rounded-full object-cover"
                src={twitt.user_profile}
                alt={twitt.name!}
              />
            </Link>
            <div className="flex flex-col gap-3 sm:ml-0 -ml-[7px] to-twitt">
              <div className="to-twitt">
                <div className="flex items-center justify-between relative to-twitt">
                  <div className="flex items-start whitespace-nowrap to-twitt truncate overflow-hidden gap-1">
                    <Link
                      href={`/${twitt.username}`}
                      className="font-bold max-[430px]:text-[15px] text-foreground truncate"
                    >
                      {twitt.name}
                    </Link>
                    <Link
                      href={`/${twitt.username}`}
                      className="text-default-400 overflow-hidden max-[430px]:hidden"
                    >
                      @{twitt.username}
                    </Link>
                    <p className="text-default-400">-</p>
                    <p className="text-default-400">
                      {format(new Date(twitt.created_at).toISOString(), "MMM d")}
                    </p>
                  </div>
                  <div>
                    <TwittSettings
                      user={user}
                      twitt={twitt}
                      onMenuAction={(key) => handleMenuAction(key)}
                    />
                  </div>
                </div>
                {twitt.text && (
                  <p
                    className="whitespace-pre-wrap -mt-1 break-words to-twitt"
                    dir={/[\u0600-\u06FF]/.test(twitt.text) ? "rtl" : "ltr"}
                    dangerouslySetInnerHTML={{ __html: optimizedText(twitt.text) }}
                  >
                  </p>
                )}
                {twitt.media &&
                  ["image", "gif"].includes(twitt.media_type ?? "") && (
                    <div className="mt-4 to-twitt">
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
                      {!imageSize.width && (
                        <div className="w-full h-[300px] flex items-center justify-center to-twitt border border-default rounded-2xl">
                          <LoadingSpinner noPadding />
                        </div>
                      )}
                    </div>
                  )}
                {twitt.media && twitt.media_type === "video" && (
                  <MediaPlayer src={twitt.media} className="mt-4 border border-default-200 to-twitt">
                    <MediaProvider />
                    <DefaultVideoLayout icons={defaultLayoutIcons} />
                  </MediaPlayer>
                )}
              </div>
              <TwittActions
                twitt={twitt}
                user={user}
                onCommentsClick={() => {
                  router.push(`/post?replyto=${twitt.id}`);
                }}
                onRetwitt={handleRetwitt}
                onLike={handleTwittLike}
                onBookmark={handleBookmark}
                className="-ml-2 to-twitt"
              />
            </div>
            {message && <Alert type="fixed">{message}</Alert>}
          </div>
        </>
      )}
      {showDeleteConfirm && (
        <DeleteConfirm
          desc="This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. "
          action={handleTwittDelete}
          onClose={() => setShowDeleteConfirm(false)}
          pending={pending}
        >
          Delete Post?
        </DeleteConfirm>
      )}
    </div>
  );
}

export default Twitt;
