"use client"

import React, { useState } from "react";
import { User, UserData } from "@/app/_lib/definitions";
import PeopleCard from "./PeopleCard";
import { follow, unFollow } from "@/app/_lib/actions";

function People({ people, user: initialUser }: { people: (Omit<User, "password">)[], user: Omit<UserData, "bookmarks" | "twitts"> }) {
  const [user, setUser] = useState(initialUser);

  async function handleFollow(user_id: number) {
    setTimeout(() => {
      setUser(prev => ({ ...prev, follows: { ...prev.follows, followers: [...prev.follows.followers, user.id as number] } }));
    }, 600);
    await follow(user.id, user_id);
  }

  async function handleUnfollow(user_id: number) {
    setTimeout(() => {
      setUser(prev => ({ ...prev, follows: { ...prev.follows, followers: prev.follows.followers.filter(follower => follower != user.id) } }));
    }, 600);
    await unFollow(user.id, user_id);
  }

  return (
    <div>
      <h2 className="p-4 text-2xl font-bold">People</h2>
      {people.map(person => (
        <PeopleCard key={person.id} user={person} onFollow={handleFollow} onUnfollow={handleUnfollow} isFollowing={user.follows.followings.some(following => following == person.id)} hideFollowingButton={user.id === person.id} />
      ))}
    </div>
  )
}

export default People;
