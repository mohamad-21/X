import React, { Suspense } from "react";
import TwittWrapper from "./TwittWrapper";
import TwittHeader from "./TwittHeader";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";

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
