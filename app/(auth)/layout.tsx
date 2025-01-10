import React, { Suspense } from "react";
import SignupForm from "@/app/(auth)/i/flow/signup/SignupForm";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import LanguageSwitcher from "../_ui/LanguageSwitcher";

export default async function Layout({
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
      <div className="absolute top-10 lg:left-4 right-4 max-w-max">
        <LanguageSwitcher size="sm" />
      </div>
    </div>
  );
}
