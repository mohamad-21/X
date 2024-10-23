import React from "react";
import { User } from "@/app/_lib/definitions";
import FollowButton from "./FollowButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

function PeopleCard({ user, isFollowing, onFollow, onUnfollow, hideFollowingButton }: { user: Omit<User, 'password'>, isFollowing: boolean, onFollow: (user_id: number) => any, onUnfollow: (user_id: number) => any, hideFollowingButton?: boolean }) {
  const { profile, name, username, bio, website } = user;
  const router = useRouter();

  function handleClick(e: React.MouseEvent<any>) {
    const targetClassList = (e.target as Element).classList;
    if (targetClassList.contains("to-user")) {
      router.push(`/${user.username}`, { scroll: false });
    }
  }

  return (
    <li className="bg-transparent hover:bg-default/15 transition cursor-pointer py-3 px-4 flex items-center justify-between gap-2 to-user" onClick={handleClick}>
      <div className="flex gap-3 to-user">
        <Link href={`/${user.username}`}>
          <img src={profile} className="w-[40px] h-[40px] rounded-full" alt={`${name}s profile image`} />
        </Link>
        <div className="inline-flex flex-col">
          <Link href={`/${user.username}`} className="text-lg font-bold text-foreground">{name}</Link>
          <h3 className="to-user text-default-400">@{username}</h3>
          {bio && (
            <h3 className="to-user whitespace-pre-wrap break-words">{bio}</h3>
          )}
          {website && (
            <h3 className="to-user text-primary">{website}</h3>
          )}
        </div>
      </div>
      {!hideFollowingButton && (
        <FollowButton isFollowing={isFollowing} onFollow={() => onFollow(user.id as number)} onUnfollow={() => onUnfollow(user.id as number)} />
      )}
    </li>
  )
}

export default PeopleCard;
