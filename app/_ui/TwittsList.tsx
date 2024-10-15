"use client";

import React from "react";
import { ITwitt } from "@/app/_lib/definitions";
import { setTwitts as setTwittsSlice } from "@/app/_lib/slices/appSlice";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import Twitt from "./Twitt";

type TwittsListProps = {
  session: Session | null;
  allTwitts: ITwitt[];
  mediaOnly?: boolean;
  userId?: number | string;
  twittId?: number | string;
  type?: "without_replies" | "with_replies" | "comments";
};

function TwittsList({
  session,
  allTwitts,
  mediaOnly = false,
  userId,
  twittId,
  type,
}: TwittsListProps) {
  const [twitts, setTwitts] = useState(allTwitts);
  const dispatch = useDispatch();
  useSWR<ITwitt[]>(
    `${type === "comments"
      ? "/api/twitts/comments"
      : (
        userId
          ? "/api/user/twitts"
          : "/api/twitts"
      )
    }`,
    async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/${type === "comments"
          ? `twitts/comments?id=${twittId}`
          : userId
            ? `user/twitts?id=${userId}${type === "without_replies" ? "&include_replies=false" : ""
            }`
            : `twitts${type === "without_replies" ? "?include_replies=false" : ""
            }`
        }`
      );
      const data = await resp.json();
      setTwitts(data);
      return data;
    },
    {
      fallbackData: allTwitts,
    }
  );

  useEffect(() => {
    if (twitts) {
      dispatch(setTwittsSlice(twitts));
    }
  }, [twitts]);

  const groupedTwitts = [];
  for (let i = 0; i < twitts.length; i += 3) {
    groupedTwitts.push(twitts.slice(i, i + 3));
  }

  return (
    <div className={`overflow-hidden w-full min-h-[100dvh]`}>
      {mediaOnly ? (
        <>
          {groupedTwitts?.map((group, idx) => (
            <div key={idx} className="flex gap-1">
              {group.map((twitt) => (
                <div className="w-[33.33%]" key={twitt.id}>
                  <Twitt
                    user={session?.user!}
                    twitt={twitt}
                    setTwitts={setTwitts}
                    mediaOnly={mediaOnly}
                  />
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <>
          {twitts?.map((twitt) => (
            <Twitt
              user={session?.user!}
              key={twitt.id}
              twitt={twitt}
              setTwitts={setTwitts}
              mediaOnly={mediaOnly}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default TwittsList;
