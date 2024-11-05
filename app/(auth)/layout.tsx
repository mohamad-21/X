import React, { Suspense } from "react";
import SignupForm from "@/app/(auth)/i/flow/signup/SignupForm";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await new Promise((res) => setTimeout(res, 3000));
  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <SignupForm />
      <Suspense fallback={<LoadingSpinner type="fullscreen" />}>
        {children}
      </Suspense>
    </div>
  );
}
