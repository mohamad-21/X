"use client";

import { ITwitt, User, UserData } from "@/app/_lib/definitions";
import { setTwitts as setTwittsSlice } from "@/app/_lib/slices/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import Twitt from "./Twitt";
import { refreshInterval } from "../_lib/swr";

type TwittsListProps = {
  user: UserData;
  allTwitts: ITwitt[];
  mediaOnly?: boolean;
  userId?: number | string;
  twittId?: number | string;
  noRevalidate?: boolean;
  type?: "without_replies" | "with_replies" | "comments";
  isBookmarksList?: boolean
};

function TwittsList({
  user,
  allTwitts,
  mediaOnly = false,
  userId,
  noRevalidate,
  twittId,
  type,
  isBookmarksList
}: TwittsListProps) {
  return noRevalidate ? <TwittsListWithoutRevalidation
    user={user}
    allTwitts={allTwitts}
    mediaOnly={mediaOnly}
    userId={userId}
    isBookmarksList={isBookmarksList}
  /> : <TwittsListWithRevalidation
    user={user}
    allTwitts={allTwitts}
    mediaOnly={mediaOnly}
    userId={userId}
    twittId={twittId}
    type={type}
    isBookmarksList={isBookmarksList}
  />
}

function TwittsListWithRevalidation({
  user: initialUser,
  allTwitts,
  mediaOnly = false,
  userId,
  twittId,
  type,
  isBookmarksList
}: TwittsListProps) {

  const [user, setUser] = useState(initialUser);
  const dispatch = useDispatch();
  const [twitts, setTwitts] = useState(allTwitts);
  const [isActionOccurrs, setIsActionOccurrs] = useState(false);
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
      if (!isActionOccurrs) {
        setTwitts(data);
      }
      return data;
    },
    {
      refreshInterval: refreshInterval,
    }
  );
  useSWR<UserData>('/api/user/info', async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/info?id=${user.id}`);
    const data = await resp.json();
    if (!isActionOccurrs) {
      setUser(data);
    }
    return data;
  }, {
    refreshInterval: refreshInterval
  });

  useEffect(() => {
    setTwitts(allTwitts);
  }, [allTwitts]);

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
                    setIsActionOccurrs={setIsActionOccurrs}
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
          {(userId ? [...twitts.filter(twitt => twitt.is_pinned === 1), ...twitts.filter(twitt => twitt.is_pinned === 0)] : twitts).map(twitt => (
            <Twitt
              user={user}
              key={twitt.id}
              twitt={twitt}
              setTwitts={setTwitts}
              setIsActionOccurrs={setIsActionOccurrs}
              twitts={twitts}
              isUserTwitts={user.id === userId}
              isRetwittAndInUserTwitts={Boolean(userId && twitt.isRetwitt)}
              mediaOnly={mediaOnly}
              setUser={setUser}
              isBookmarksList={isBookmarksList}
            />
          ))}
        </>
      )}
    </div>
  );
}

function TwittsListWithoutRevalidation({
  user,
  allTwitts,
  mediaOnly = false,
  userId,
  isBookmarksList
}: TwittsListProps) {

  const dispatch = useDispatch();
  const [twitts, setTwitts] = useState(allTwitts);

  useEffect(() => {
    if (twitts) {
      dispatch(setTwittsSlice(twitts));
    }
  }, [twitts]);

  useEffect(() => {
    if (allTwitts) {
      setTwitts(allTwitts);
    }
  }, [allTwitts]);

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
          {(userId ? [...twitts.filter(twitt => twitt.is_pinned === 1), ...twitts.filter(twitt => twitt.is_pinned === 0)] : twitts).map(twitt => (
            <Twitt
              user={user}
              key={twitt.id}
              twitt={twitt}
              setTwitts={setTwitts}
              twitts={twitts}
              isUserTwitts={Boolean(userId)}
              isRetwittAndInUserTwitts={Boolean(userId && twitt.isRetwitt)}
              mediaOnly={mediaOnly}
              isBookmarksList={isBookmarksList}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default TwittsList;
