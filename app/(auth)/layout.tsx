import React, { Suspense } from "react";
import SignupForm from "@/app/(auth)/i/flow/signup/SignupForm";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center flex-1 px-4">
      <SignupForm />
      <Suspense fallback={<LoadingSpinner type="fullscreen" />}>
        {children}
      </Suspense>
    </div>
  );
}
