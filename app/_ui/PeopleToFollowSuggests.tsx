import React from "react";
import { getUserDetailsById, getWhoToFollowSuggestings } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import People from "./People";
import { getTranslations } from "next-intl/server";

async function PeopleToFollowSuggests() {
  const session = await auth();
  const [user, suggestedPeople] = await Promise.all([
    getUserDetailsById(session!.user.id),
    getWhoToFollowSuggestings(session!.user.id)
  ]);
  const t = await getTranslations();

  if (!suggestedPeople.length || !user) return null;

  return (
    <People user={user} people={suggestedPeople} title={t("whoToFollow")} size="sm" />
  )
}

export default PeopleToFollowSuggests;
