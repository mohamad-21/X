import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import NotificationsWrapper from "@/app/_ui/notifications/NotificationsWrapper";
import PageHeader from "@/app/_ui/PageHeader";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Notifications"
}

function Page() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <Suspense fallback={<LoadingSpinner />}>
        <NotificationsWrapper />
      </Suspense>
    </div>
  )
}

export default Page;
