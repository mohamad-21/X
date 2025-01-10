import React, { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { auth } from "@/app/_lib/auth";
import BottomNavigation from "./BottomNavigation";
import Navigation from "./Navigation";
import NotificationsUpdater from "./NotificationsUpdater";
import { getUserDetailsById } from "../_lib/actions";

function SidebarWrapper() {
  return (
    <div className="sm:h-[100dvh] flex sm:flex-col justify-between items-center w-full xl:max-w-[300px] sm:max-w-[85px] max-w-full overflow-hidden text-foreground py-3 gap-12 flex-1 sm:sticky sm:top-0 left-0 bg-background fixed bottom-0 sm:border-t-0 border-t border-default z-[5]">
      <Suspense fallback={<LoadingSpinner noPadding />}>
        <Sidebar />
      </Suspense>
    </div>
  )
}

async function Sidebar() {
  const session = await auth();
  if (!session) return;

  const user = await getUserDetailsById(session!.user.id);
  if (!user) return;

  return (
    <>
      <Navigation user={user} />
      <NotificationsUpdater />
      <BottomNavigation user={user} />
    </>
  )
}



export default SidebarWrapper;
