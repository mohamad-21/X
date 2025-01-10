"use client";

import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import React, { useEffect, useState, useTransition } from "react";
import LoadingSpinner from "./LoadingSpinner";

function FollowButton({ isFollowing, onFollow, onUnfollow, size }: { isFollowing: boolean, onFollow: () => any, onUnfollow: () => any, size?: any }) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [followingText, setFollowingText] = useState(isFollowing ? t("following") : t("follow"));

  useEffect(() => {
    setFollowingText(isFollowing ? t("following") : t("follow"));
  }, [isFollowing]);

  return (
    <>
      {isFollowing ? (
        <Button variant="bordered" size={size} className={`font-bold ${size === 'sm' ? '' : 'text-base'} hover:border-danger/75 hover:bg-danger/20 hover:text-danger`} radius="full" onPointerMove={() => setFollowingText(t("unfollow"))} onPointerLeave={() => setFollowingText(t("following"))} onClick={() => startTransition(async () => {
          onUnfollow();
        })} isDisabled={isPending} isLoading={isPending} spinner={<LoadingSpinner size="sm" noPadding />}>
          {followingText}
        </Button>
      ) : (
        <Button onClick={() => startTransition(async () => {
          onFollow();
        })} size={size} color="secondary" className={`font-bold ${size === 'sm' ? '' : 'text-base'}`} radius="full" isDisabled={isPending} spinner={<LoadingSpinner size="sm" noPadding />} isLoading={isPending}>
          {t("follow")}
        </Button>
      )}
    </>
  )
}

export default FollowButton;
