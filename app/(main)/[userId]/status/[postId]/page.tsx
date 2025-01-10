import React, { Suspense } from "react";
import TwittWrapper from "./TwittWrapper";
import TwittHeader from "./TwittHeader";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import { getTwittById } from "@/app/_lib/actions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  const twitt = await getTwittById(params.postId);
  const t = await getTranslations();
  if (!twitt) return { title: "not found" };
  return {
    title: `${twitt.name} ${t("onX")}`,
  };
}

function Page({ params }: { params: { postId: string } }) {
  return (
    <div>
      <TwittHeader />
      <Suspense fallback={<LoadingSpinner />}>
        <TwittWrapper postId={params.postId} />
      </Suspense>
    </div>
  );
}

export default Page;
