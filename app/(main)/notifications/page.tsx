import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import NotificationsWrapper from "@/app/_ui/notifications/NotificationsWrapper";
import PageHeader from "@/app/_ui/PageHeader";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import React, { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("notifications"),
  };
}

async function Page() {
  const t = await getTranslations();

  return (
    <div>
      <PageHeader title={t("notifications")} />
      <Suspense fallback={<LoadingSpinner />}>
        <NotificationsWrapper />
      </Suspense>
    </div>
  );
}

export default Page;
