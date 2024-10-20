import React, { Suspense } from "react";
import TwittWrapper from "./TwittWrapper";
import TwittHeader from "./TwittHeader";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { getTwittById } from "@/app/_lib/actions";

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const twitt = await getTwittById(params.postId);
  if (!twitt) return { title: "not found" }
  return {
    title: `${twitt.name} on X : ${twitt?.text}`
  }
}

function Page({ params }: { params: { postId: string } }) {
  return (
    <div>
      <TwittHeader />
      <Suspense fallback={<LoadingSpinner />}>
        <TwittWrapper postId={params.postId} />
      </Suspense>
    </div>
  )
}

export default Page;
