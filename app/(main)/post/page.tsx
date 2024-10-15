import React, { Suspense } from "react";
import PostModal from "@/app/_ui/createPost/PostModal";
import CreatePostWrapper from "@/app/_ui/createPost/CreatePostWrapper";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { Metadata } from "next";

export function generateMetadata({ searchParams }: {
  searchParams?: { [key: string]: string | null }
}): Metadata {
  const replyTo = searchParams?.replyto;
  return {
    title: replyTo ? 'Post your reply' : 'Create post'
  }
}

function Page({ searchParams }: {
  searchParams?: { [key: string]: string | null }
}) {
  return (
    <PostModal>
      <Suspense fallback={<LoadingSpinner />}>
        <CreatePostWrapper replyTo={searchParams?.replyto} />
      </Suspense>
    </PostModal>
  )
}

export default Page;
