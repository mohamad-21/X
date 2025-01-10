import React, { Suspense } from 'react';
import SidebarWrapper from "@/app/_ui/SidebarWrapper";
import LoadingSpinner from '@/app/_ui/LoadingSpinner';
import RightSectionWrapper from '@/app/_ui/RightSectionWrapper';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <SidebarWrapper />
      <div className="flex-1 w-full max-w-2xl sm:border-x border-x-default sm:pb-0 pb-36">
        <Suspense fallback={<LoadingSpinner type="fullheight" />}>
          {children}
        </Suspense>
      </div>
      <div className="sticky right-0 top-0 bottom-0 h-[100dvh] overflow-hidden lg:flex items-center flex-col gap-4 max-w-[330px] px-6 flex-1 hidden py-3">
        <Suspense fallback={<LoadingSpinner />}>
          <RightSectionWrapper />
        </Suspense>
      </div>
    </>
  );
}
