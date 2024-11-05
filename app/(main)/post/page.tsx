import React, { Suspense } from "react";
import PostModal from "@/app/_ui/createPost/PostModal";
import CreatePostWrapper from "@/app/_ui/createPost/CreatePostWrapper";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | null };
}): Promise<Metadata> {
  const replyTo = searchParams?.replyto;
  const t = await getTranslations();
  return {
    title: replyTo ? t("postYourReply") : t("post"),
  };
}

function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | null };
}) {
  return (
    <PostModal>
      <Suspense fallback={<LoadingSpinner />}>
        <CreatePostWrapper replyTo={searchParams?.replyto} />
      </Suspense>
    </PostModal>
  );
}

export default Page;
