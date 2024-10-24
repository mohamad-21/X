import {
  getTwittById,
  getUserFollowersAndFollowings,
} from "@/app/_lib/actions";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Twitt from "./Twitt";
import { auth } from "@/app/_lib/auth";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import TwittCommentsWrapper from "./TwittCommentsWrapper";
import { getUserDetailsFromAPI } from "@/app/_lib/actions";

async function TwittWrapper({ postId }: { postId: string }) {
  console.log(postId);
  const [session, twitt] = await Promise.all([
    auth(),
    getTwittById(postId),
  ]);

  if (!twitt) notFound();
  const [twittUserFollows, user] = await Promise.all([
    getUserFollowersAndFollowings(twitt.user_id),
    getUserDetailsFromAPI(session?.user.id!)
  ]);
  const twittWithFollows = { ...twitt, follows: twittUserFollows };

  return (
    <div className="mt-3">
      <Twitt data={twittWithFollows} user={user} />
      {twitt.comments.length > 0 && (
        <Suspense fallback={<LoadingSpinner />}>
          <TwittCommentsWrapper postId={postId} />
        </Suspense>
      )}
    </div>
  );
}

export default TwittWrapper;
