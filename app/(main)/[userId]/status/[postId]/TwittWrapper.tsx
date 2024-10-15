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

async function TwittWrapper({ postId }: { postId: string }) {
  const [session, twitt] = await Promise.all([
    auth(),
    getTwittById(postId),
  ]);

  if (!twitt) notFound();
  const follows = await getUserFollowersAndFollowings(twitt.user_id);
  const twittWithFollows = { ...twitt, follows };

  return (
    <div className="mt-3">
      <Twitt data={twittWithFollows} sessionUser={session?.user!} />
      {twitt.comments.length > 0 && (
        <Suspense fallback={<LoadingSpinner />}>
          <TwittCommentsWrapper postId={postId} />
        </Suspense>
      )}
    </div>
  );
}

export default TwittWrapper;
