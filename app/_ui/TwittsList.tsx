"use client";

import { ITwitt, UserWithFollows } from "@/app/_lib/definitions";
import { setTwitts as setTwittsSlice } from "@/app/_lib/slices/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import Twitt from "./Twitt";

type TwittsListProps = {
  user: UserWithFollows;
  allTwitts: ITwitt[];
  mediaOnly?: boolean;
  userId?: number | string;
  twittId?: number | string;
  type?: "without_replies" | "with_replies" | "comments";
};

function TwittsList({
  user: initialUser,
  allTwitts,
  mediaOnly = false,
  userId,
  twittId,
  type,
}: TwittsListProps) {
  const [user, setUser] = useState(initialUser);
  const dispatch = useDispatch();
  const [twitts, setTwitts] = useState(allTwitts);
  const [likedTwitts, setLikedTwitts] = useState<ITwitt[]>([]);
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
            ? (`user/twitts?id=${userId}${mediaOnly ? '&media_only=true' : ''}${type === "without_replies" ? "&include_replies=false" : ""
              }`)
            : `twitts${type === "without_replies" ? "?include_replies=false" : ""
            }`
        }`
      );
      const data: ITwitt[] = await resp.json();
      if (data) {
        if (likedTwitts) {
          setTwitts(data.map((twitt, idx) => {
            if (twitt.id === likedTwitts[idx].id) {
              let allLikes = [...twitt.likes, ...likedTwitts[idx].likes];
              allLikes = allLikes.filter((like, idx) => allLikes.indexOf(like) !== idx);
              twitt = {
                ...twitt,
                likes: allLikes
              }
            }
            return twitt;
          }));
        } else {
          setTwitts(data);
        }
      }
      return data;
    },
    {
      refreshInterval: 2000,
    }
  );
  useSWR<UserWithFollows>('/api/user/details', async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/details?id=${user.id}`);
    const data = await resp.json();
    if (data) {
      setUser(data);
    }
    return data;
  }, {
    refreshInterval: 10000
  });

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
                    user={user}
                    twitt={twitt}
                    setTwitts={setTwitts}
                    setLikedTwitts={setLikedTwitts}
                    twitts={twitts}
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
              user={user}
              key={twitt.id}
              twitt={twitt}
              setTwitts={setTwitts}
              setLikedTwitts={setLikedTwitts}
              twitts={twitts}
              mediaOnly={mediaOnly}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default TwittsList;
