import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";
import PeopleToFollowSuggests from "./PeopleToFollowSuggests";
import { getTranslations } from "next-intl/server";

async function RightSectionWrapper() {
  const t = await getTranslations();

  return (
    <>
      <div className="p-4 rounded-2xl border border-default flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t("subscribePremiumTitle")}</h2>
        <p>{t("subscribePremiumDesc")}</p>
        <Button color="primary" as={Link} href="#" radius="full" className="text-base font-bold max-w-max hover:no-underline">{t("subscribe")}</Button>
      </div>
      <div className="py-4 rounded-2xl border border-default w-full">
        <PeopleToFollowSuggests />
      </div>
    </>
  )
}

export default RightSectionWrapper;
