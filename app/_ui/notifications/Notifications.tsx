"use client";

import { readNotifications } from "@/app/_lib/actions";
import { INotification, SessionUser } from "@/app/_lib/definitions";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import TwittView from "@/app/_ui/TwittView";
import { optimizedText } from "@/app/_utils/optimizedText";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BiSolidUser } from "react-icons/bi";
import { FaComment, FaHeart } from "react-icons/fa";
import { useSWRConfig } from "swr";

function Notifications({ notif, user }: { notif: INotification, user: SessionUser }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { twitt } = notif;

  useEffect(() => {
    mutate('/api/user/notifications');
    (async () => {
      await readNotifications({ user });
    })()
  }, []);

  function handleNotifClick(e: React.MouseEvent<HTMLDivElement>) {
    const targetClassList = (e.target as Element).classList;
    if (!targetClassList.contains("to-twitt")) return;

    if (notif.place_id) {
      if (notif.type === 'reply') {
        router.push(`/${notif.username}/status/${notif.place_id}`);
      }
      if (notif.type === 'follow') {
        router.push(`/${notif.username}`);
      }
      if (notif.type === 'like') {
        router.push(`/${notif.user_id}/status/${notif.place_id}`);
      }

    }
  }

  return (
    <div className="first:border-t border-b border-default p-4 bg-transparent hover:bg-default/15 transition cursor-pointer flex gap-2 to-twitt" onClick={handleNotifClick}>
      <div>
        {notif.type === 'follow' && <BiSolidUser size={30} className="text-primary" />}
        {notif.type === 'like' && <FaHeart size={25} className="text-danger" />}
        {notif.type === 'reply' && <FaComment size={25} className="text-primary" />}
      </div>
      <div className="flex flex-col gap-2">
        <Link href={`/${notif.username}`} className=" max-w-max">
          <img src={notif.profile} className="w-[35px] h-[35px] rounded-full" alt={notif.name} />
        </Link>
        <div className="to-twitt">
          <h3 className="flex items-center gap-1">
            <Link href={`/${notif.username}`} className="font-bold text-foreground">{notif.name}</Link>
            {notif.type === 'like' && (
              <span className="to-twitt">liked your post</span>
            )}
            {notif.type === 'follow' && (
              <span className="to-twitt">started to following you</span>
            )}
            {notif.type === 'reply' && (
              <span className="to-twitt">replyed to your post:</span>
            )}
          </h3>
        </div>
        {notif.type === 'like' && (
          <div>
            {twitt ? (
              <TwittView
                twitt={twitt}
                user={user}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <LoadingSpinner />
              </div>
            )}
          </div>
        )}
        {(notif.type === 'reply' && notif.text) && (
          <p
            className="whitespace-pre-wrap leading-5 break-words to-twitt text-lg"
            dir={/[\u0600-\u06FF]/.test(notif.text) ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{
              __html: optimizedText(notif.text),
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Notifications;
