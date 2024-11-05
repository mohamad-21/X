import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

function FollowButton({ isFollowing, onFollow, onUnfollow, size }: { isFollowing: boolean, onFollow: () => any, onUnfollow: () => any, size?: any }) {
  const t = useTranslations();
  const [followingText, setFollowingText] = useState(isFollowing ? t("following") : t("follow"));

  useEffect(() => {
    setFollowingText(isFollowing ? t("following") : t("follow"));
  }, [isFollowing]);

  return (
    <>
      {isFollowing ? (
        <Button variant="bordered" size={size} className={`font-bold ${size === 'sm' ? '' : 'text-base'} hover:border-danger/75 hover:bg-danger/20 hover:text-danger`} radius="full" onPointerEnter={() => setFollowingText(t("unfollow"))} onPointerLeave={() => setFollowingText(t("following"))} onClick={onUnfollow}>
          {followingText}
        </Button>
      ) : (
        <Button onClick={onFollow} size={size} color="secondary" className={`font-bold ${size === 'sm' ? '' : 'text-base'}`} radius="full">
          {t("follow")}
        </Button>
      )}
    </>
  )
}

export default FollowButton;
