import {
  deleteTwitt,
  follow,
  increaseTwittView,
  likeTwitt,
  unFollow,
} from "@/app/_lib/actions";
import { ITwitt, SessionUser, User, UserWithFollows } from "@/app/_lib/definitions";
import { useAppDispatch, useIsVisible } from "@/app/_lib/hooks";
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
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import { KeyedMutator, useSWRConfig } from "swr";
import DeleteConfirm from "./DeleteConfirm";
import TwittActions from "./TwittActions";
import TwittSettings from "./TwittSettings";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";
import { optimizedText } from "@/app/_utils/optimizedText";
import { useMutateAll } from "../_lib/swr";

export const ActionTypes = {
  INCREASE_VIEW: "INCREASE_VIEW",
  LIKE_TWITT: "LIKE_TWITT",
  UNLIKE_TWITT: "UNLIKE_TWITT",
};

type TwittProps = {
  twitt: ITwitt;
  user: UserWithFollows;
  mutateTwitts: KeyedMutator<ITwitt[]>;
  twitts: ITwitt[];
  mediaOnly?: boolean;
};

function Twitt({
  twitt,
  user,
  mutateTwitts,
  twitts,
  mediaOnly,
}: TwittProps) {
  const [imageSize, setSmageSize] = useState({
    width: 0,
    height: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const twittRef = useRef(null);
  const isVisible = useIsVisible(twittRef);
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const mutateAll = useMutateAll();
  const [pending, startTransition] = useTransition();

  async function handleIncreaseView() {
    mutateTwitts(twitts.map(state => {
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
    const likeType = twitt.likes.some((like) => like == user.id!)
      ? ActionTypes.UNLIKE_TWITT
      : ActionTypes.LIKE_TWITT;

    mutateTwitts(twitts.map((state) => {
      if (twitt.id === state.id) {
        state = {
          ...state,
          likes: likeType == ActionTypes.LIKE_TWITT ? [...state.likes, user.id!] : state.likes.filter((like) => like != user.id!),
        };
      }
      return state;
    }), false);
    await likeTwitt({ twitt, user_id: user.id! });
  }

  function handleTwittClick(e: React.MouseEvent<any>) {
    const targetClassList = (e.target as Element).classList;
    if (targetClassList.contains("to-twitt")) {
      router.push(`/${user.username}/status/${twitt.id}`, { scroll: false });
    }
  }

  async function handleMenuAction(key: Key) {
    setMessage("");
    if (key === "delete") {
      setShowDeleteConfirm(true);
    } else if (key === "follow") {
      await follow(user.id, twitt.user_id);
      mutate('/api/user/details');
      setMessage(`You're now following @${twitt.username}`);
    } else if (key === "unfollow") {
      await unFollow(user.id, twitt.user_id);
      mutate('/api/user/details');
      setMessage(`@${twitt.username} now is not in your followings`);
    } else {
      setMessage("This action is not available for now.");
    }
  }

  async function handleTwittDelete() {
    startTransition(async () => {
      await deleteTwitt(twitt.id);
      // setTwitts((prev) => prev.filter((t) => t.id !== twitt.id));
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
                  dangerouslySetInnerHTML={{
                    __html: optimizedText(twitt.text),
                  }}
                />
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
              onLike={handleTwittLike}
              className="-ml-2 to-twitt"
            />
          </div>
          {message && <Alert type="fixed">{message}</Alert>}
        </div>
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
