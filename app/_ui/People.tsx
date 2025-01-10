"use client"

import React, { useState } from "react";
import { User, UserData } from "@/app/_lib/definitions";
import PeopleCard from "./PeopleCard";
import { follow, unFollow } from "@/app/_lib/actions";

function People({ people, user: initialUser, title, size }: { people: (Omit<User, "password">)[], user: Omit<UserData, "bookmarks" | "twitts">, title: string, size?: any }) {
  const [user, setUser] = useState(initialUser);

  async function handleFollow(user_id: number) {
    await follow(user.id, user_id);
    setUser(prev => ({ ...prev, follows: { ...prev.follows, followings: [...prev.follows.followings, user_id] } }));
  }

  async function handleUnfollow(user_id: number) {
    await unFollow(user.id, user_id);
    setUser(prev => ({ ...prev, follows: { ...prev.follows, followings: prev.follows.followings.filter(following => following != user_id) } }));
  }

  return (
    <div>
      <h2 className="p-4 text-2xl font-bold">{title}</h2>
      {people.map(person => (
        <PeopleCard key={person.id} user={person} onFollow={handleFollow} onUnfollow={handleUnfollow} isFollowing={user.follows.followings.some(following => following == person.id)} hideFollowingButton={user.id === person.id} size={size} />
      ))}
    </div>
  )
}

export default People;
