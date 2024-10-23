import { Button } from "@nextui-org/button";
import React, { useState } from "react";

function FollowButton({ isFollowing, onFollow, onUnfollow }: { isFollowing: boolean, onFollow: () => any, onUnfollow: () => any }) {
  const [followingText, setFollowingText] = useState(isFollowing ? "Following" : "follow");

  return (
    <>
      {isFollowing ? (
        <Button variant="bordered" className="font-bold text-base hover:border-danger/75 hover:bg-danger/20 hover:text-danger" radius="full" onPointerEnter={() => setFollowingText("Unfollow")} onPointerLeave={() => setFollowingText("Following")} onClick={onUnfollow}>
          {followingText}
        </Button>
      ) : (
        <Button onClick={onFollow} color="secondary" className="font-bold text-base" radius="full">
          Follow
        </Button>
      )}
    </>
  )
}

export default FollowButton;
