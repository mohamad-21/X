import React from "react";
import CreatePost from "@/app/_ui/createPost/CreatePost";
import { auth } from "@/app/_lib/auth";
import { getTwittById } from "@/app/_lib/actions";
import { getUserDataById } from "@/app/_lib/actions";

async function CreatePostWrapper({ replyTo }: { replyTo?: number | string | null }) {
  const [session, twitt] = await Promise.all([
    auth(),
    replyTo ? getTwittById(replyTo) : null
  ]);

  if (!session?.user) return;

  const user = await getUserDataById(session.user.id);

  if (!user) return;

  return (
    <CreatePost
      user={user}
      asModal
      initialReplyTo={twitt}
    />
  )
}

export default CreatePostWrapper;
