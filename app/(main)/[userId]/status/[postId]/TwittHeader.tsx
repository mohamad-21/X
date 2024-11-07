"use client";

import PageHeader from "@/app/_ui/PageHeader";
import { useTranslations } from "next-intl";

function TwittHeader() {
  const t = useTranslations();
  return <PageHeader title={t("postHeaderTitle")} />;
}

export default TwittHeader;
