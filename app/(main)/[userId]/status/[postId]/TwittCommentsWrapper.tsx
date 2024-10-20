import { getTwittComments } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { getUserDetailsFromAPI } from "@/app/_lib/actions";
import TwittsList from "@/app/_ui/TwittsList";
import React from "react";

async function TwittCommentsWrapper({ postId }: { postId: string }) {
  const [session, twitts] = await Promise.all([
    auth(),
    getTwittComments(postId),
  ]);

  const user = await getUserDetailsFromAPI(session?.user.id!);

  return (
    <TwittsList
      twittId={postId}
      type="comments"
      allTwitts={twitts}
      user={user}
    />
  );
}

export default TwittCommentsWrapper;
