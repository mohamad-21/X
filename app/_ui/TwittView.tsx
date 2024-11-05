import {
  deleteTwitt,
  follow,
  increaseTwittView,
  likeTwitt,
  pushNotification,
  unFollow,
} from "@/app/_lib/actions";
import { ITwitt, SessionUser } from "@/app/_lib/definitions";
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
import { useSWRConfig } from "swr";
import DeleteConfirm from "./DeleteConfirm";
import TwittActions from "./TwittActions";
import TwittSettings from "./TwittSettings";
import Alert from "./Alert";
import LoadingSpinner from "./LoadingSpinner";
import { optimizedText } from "@/app/_utils/optimizedText";
import Image from "next/image";

export const ActionTypes = {
  INCREASE_VIEW: "INCREASE_VIEW",
  LIKE_TWITT: "LIKE_TWITT",
  UNLIKE_TWITT: "UNLIKE_TWITT",
};

type TwittProps = {
  twitt: ITwitt;
  user: SessionUser;
  mediaOnly?: boolean;
};

function TwittView({ twitt, user, mediaOnly }: TwittProps) {
  const [imageSize, setSmageSize] = useState({
    width: 0,
    height: 0,
  });
  const twittRef = useRef(null);
  const isVisible = useIsVisible(twittRef);
  const router = useRouter();

  async function handleIncreaseView() {
    await increaseTwittView(twitt.id, user.id!);
  }

  function handleTwittClick(e: React.MouseEvent<any>) {
    const targetClassList = (e.target as Element).classList;
    if (targetClassList.contains("to-twitt")) {
      router.push(`/${user.username}/status/${twitt.id}`);
    }
  }

  useEffect(() => {
    if (!isVisible) return;

    const alreadyViewed = twitt.views.some((view) => view == user.id!);

    if (!alreadyViewed) {
      handleIncreaseView();
    }
  }, [isVisible]);

  return (
    <div
      ref={twittRef}
      className={`${
        mediaOnly ? "" : "border border-default rounded-2xl p-4"
      } bg-transparent hover:bg-default/15 transition cursor-pointer to-twitt w-full`}
      onClick={handleTwittClick}
    >
      {mediaOnly ? (
        <Link href={`/${user.username}`} className="w-full h-full relative">
          <img
            src={twitt.media!}
            className="w-full h-full object-cover aspect-square"
            alt={twitt.text}
          />
        </Link>
      ) : (
        <div
          className="grid gap-4 to-twitt"
          style={{ gridTemplateColumns: "30px 1fr" }}
        >
          <Link
            href={`/${twitt.username}`}
            className="w-[30px] h-[30px] flex-shrink-0"
          >
            <img
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-full object-cover"
              src={twitt.user_profile}
              alt={twitt.name!}
            />
          </Link>
          <div className="flex flex-col gap-2 sm:ml-0 -ml-[7px] to-twitt">
            <div className="to-twitt">
              <div className="flex items-center justify-between relative">
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
              </div>
              {twitt.text && (
                <p
                  className="whitespace-pre-wrap leading-5 break-words to-twitt text-lg"
                  dir={/[\u0600-\u06FF]/.test(twitt.text) ? "rtl" : "ltr"}
                  dangerouslySetInnerHTML={{
                    __html: optimizedText(twitt.text),
                  }}
                />
              )}
              {twitt.media &&
                ["image", "gif"].includes(twitt.media_type ?? "") && (
                  <div className="mt-4 to-twitt rounded-2xl ">
                    <img
                      src={twitt.media}
                      alt={twitt.text}
                      className={`${
                        imageSize.width ? "" : "hidden"
                      } to-twitt object-cover rounded-2xl`}
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
                      <div className="w-full h-[300px] flex items-center justify-center to-twitt">
                        <LoadingSpinner noPadding />
                      </div>
                    )}
                  </div>
                )}
              {twitt.media && twitt.media_type === "video" && (
                <MediaPlayer src={twitt.media} className="mt-4 to-twitt">
                  <MediaProvider />
                  <DefaultVideoLayout icons={defaultLayoutIcons} />
                </MediaPlayer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TwittView;
