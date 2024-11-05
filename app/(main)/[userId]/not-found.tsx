import { getTranslations } from "next-intl/server";
import React from "react";

async function NotFound() {
  const t = await getTranslations();
  return (
    <div className="flex items-center justify-center h-full flex-1">
      <h1 className="text-2xl font-bold">{t("accountDoesNotExists")}</h1>
    </div>
  );
}

export default NotFound;
