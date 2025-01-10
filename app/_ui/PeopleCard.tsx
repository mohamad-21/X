"use client";

import { User } from "@/app/_lib/definitions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import FollowButton from "./FollowButton";
import { CheckCircleFilled } from "@ant-design/icons";

function PeopleCard({ user, isFollowing, onFollow, onUnfollow, hideFollowingButton, size }: { user: Omit<User, 'password'>, isFollowing: boolean, onFollow: (user_id: number) => any, onUnfollow: (user_id: number) => any, hideFollowingButton?: boolean, size?: any }) {
  const { profile, name, username, account_type } = user;
  const router = useRouter();

  function handleClick(e: React.MouseEvent<any>) {
    const targetClassList = (e.target as Element).classList;
    if (targetClassList.contains("to-user")) {
      router.push(`/${user.username}`, { scroll: false });
    }
  }

  return (
    <li className={`bg-transparent hover:bg-default/15 transition cursor-pointer py-3 px-4 flex items-center justify-between gap-2 to-user w-full`} onClick={handleClick}>
      <div className="flex gap-3 to-user truncate">
        <Link href={`/${user.username}`} className="flex-shrink-0">
          <img src={profile} width={40} height={40} className="w-[40px] h-[40px] rounded-full" alt={`${name}s profile image`} />
        </Link>
        <div className="inline-flex flex-col truncate">
          <Link href={`/${user.username}`} className={`${size === 'sm' ? 'text-sm' : 'text-lg'} font-bold text-foreground truncate ${size === 'sm' ? 'max-w-[140px]' : ''}`}>{name} {user.account_type !== "normal" && (
            <CheckCircleFilled className={user.account_type === "premium_plus" ? "text-warning" : "text-primary"} />
          )}</Link>
          <h3 className={`${size === 'sm' ? 'text-sm' : ''} to-user text-default-400 truncate  ${size === 'sm' ? 'max-w-[140px]' : ''}`}>@{username}</h3>
        </div>
      </div>
      {!hideFollowingButton && (
        <FollowButton isFollowing={isFollowing} onFollow={() => onFollow(user.id as number)} onUnfollow={() => onUnfollow(user.id as number)} size={size} />
      )}
    </li>
  )
}

export default PeopleCard;
