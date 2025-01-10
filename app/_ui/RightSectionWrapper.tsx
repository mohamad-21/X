import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";
import PeopleToFollowSuggests from "./PeopleToFollowSuggests";
import { getTranslations } from "next-intl/server";
import { auth } from "../_lib/auth";
import { getUserDetailsById } from "../_lib/actions";

async function RightSectionWrapper() {
  const session = await auth();
  const [user, t] = await Promise.all([
    getUserDetailsById(session?.user.id!),
    getTranslations()
  ]);

  return (
    <>
      {user?.account_type === "normal" && (
        <div className="p-4 rounded-2xl border border-default flex flex-col gap-3">
          <h2 className="text-xl font-bold">{t("subscribePremiumTitle")}</h2>
          <p>{t("subscribePremiumDesc")}</p>
          <Button
            color="secondary"
            as={Link}
            href="/premium_sign_up"
            radius="full"
            className="text-base font-bold max-w-max hover:no-underline"
          >
            {t("subscribe")}
          </Button>
        </div>
      )}
      <div className="py-4 rounded-2xl border border-default w-full overflow-auto">
        <PeopleToFollowSuggests />
      </div>
      <div className="py-4">
        <h4>
          Created by{" "}
          <a
            href="https://github.com/mohamad-21/x"
            target="_blank"
            className="text-primary"
          >
            M21
          </a>
        </h4>
      </div>
    </>
  );
}

export default RightSectionWrapper;
