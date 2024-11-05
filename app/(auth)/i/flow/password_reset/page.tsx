import { Metadata } from "next";
import PasswordResetFlow from "./PasswordResetFlow";
import React from "react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("resetPassword"),
  };
}

function Page() {
  return <PasswordResetFlow />;
}

export default Page;
