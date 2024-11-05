import LoginFlow from "@/app/(auth)/i/flow/login/LoginFlow";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("signinToX"),
  };
}

export default function Page() {
  return <LoginFlow />;
}
