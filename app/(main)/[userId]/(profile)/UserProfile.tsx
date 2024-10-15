"use client";

import { follow, unFollow } from "@/app/_lib/actions";
import { ITwitt, SessionUser, User, UserFollowingsAndFollowers } from "@/app/_lib/definitions";
import { useAppDispatch, useRouteChangeTransition } from "@/app/_lib/hooks";
import { setUserData } from "@/app/_lib/slices/userSlice";
import PageHeader from "@/app/_ui/PageHeader";
import { Button } from "@nextui-org/button";
import { Card, Tab, Tabs } from "@nextui-org/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GrAttachment } from "react-icons/gr";
import useSWR from "swr";

type Props = {
  user: User & { twitts: ITwitt[] },
  headerSubtitle: string,
  follows: UserFollowingsAndFollowers,
  sessionUser?: SessionUser
};

function UserProfile({ user, headerSubtitle, follows, sessionUser }: Props) {
  const [profileDetails, setProfileDetails] = useState({ ...user, follows });
  const [followingText, setFollowingText] = useState('Following');
  const changeRoute = useRouteChangeTransition();
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState(() => {
    if (pathname === `/${user.username}`) return 'posts';
    if (pathname === `/${user.username}/with_replies`) return 'replies';
    if (pathname === `/${user.username}/media`) return 'media';
  });
  const dispatch = useAppDispatch();
  const { update } = useSession();

  useSWR<User & { follows: UserFollowingsAndFollowers }>(`/api/user/details`, async () => {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/details?id=${user.id}`);
    const data = await resp.json();
    setProfileDetails(data);
    return data;
  }, {
    refreshInterval: 10000
  });

  async function hanldeFollow() {
    setTimeout(() => {
      setProfileDetails(prev => ({ ...prev, follows: { ...follows, followers: [...prev.follows.followers, sessionUser?.id as number] } }));
    }, 600);
    update('trigger');
    await follow(sessionUser?.id!, user.id);
  }

  async function hanldeUnfollow() {
    setTimeout(() => {
      setProfileDetails(prev => ({ ...prev, follows: { ...follows, followers: prev.follows.followers.filter(follower => follower != sessionUser?.id) } }));
    }, 600);
    update('trigger');
    await unFollow(sessionUser?.id!, user.id);
  }

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    setProfileDetails({ ...user, follows });
  }, [user, follows]);

  useEffect(() => {
    dispatch(setUserData({
      ...user,
      created_at: user.created_at as string,
      updated_at: user.updated_at as string,
      twitts: user.twitts
    }));
  }, [profileDetails]);

  useEffect(() => {
    if (pathname === `/${profileDetails.username}`) setCurrentTab('posts');
    if (pathname === `/${profileDetails.username}/with_replies`) setCurrentTab('replies');
    if (pathname === `/${profileDetails.username}/media`) setCurrentTab('media');
  }, [pathname, currentTab]);

  return (
    <div>
      <PageHeader title={profileDetails.name} desc={headerSubtitle} />
      <div>
        {profileDetails.header_photo ? (
          <Card radius="none" isPressable onClick={() => {
            changeRoute(`/${profileDetails.username}/header_photo`);
          }} className="w-full h-[200px]">
            <img src={profileDetails.header_photo!} className="w-full h-full object-cover" alt={profileDetails.name} />
          </Card>
        ) : (
          <div className="h-[200px] bg-default-200" />
        )}
        <div className="px-4 flex justify-between mb-3">
          <div className="flex flex-col -mt-[12%] gap-3">
            <Card isPressable className="h-[140px] w-[140px] min-w-max rounded-full border-4 border-background" onClick={() => {
              changeRoute(`/${profileDetails.username}/photo`);
            }}>
              <img src={profileDetails.profile} className="object-cover h-[140px] w-[140px]" alt={profileDetails.name} />
            </Card>
            <div>
              <h1 className="text-xl font-bold">{profileDetails.name}</h1>
              <p className="text-default-400">@{profileDetails.username}</p>
            </div>
            {profileDetails.bio && (
              <p>{profileDetails.bio}</p>
            )}
            <div className="flex items-center gap-4 flex-wrap">
              {profileDetails.location && (
                <div className="flex items-center gap-1 text-default-400">
                  <FaLocationDot size={15} />
                  <span>{profileDetails.location}</span>
                </div>
              )}
              {profileDetails.website && (
                <div className="flex items-center gap-1 text-default-400">
                  <GrAttachment size={15} />
                  <Link href={profileDetails.website}>{profileDetails.website}</Link>
                </div>
              )}
              <div className="flex items-center gap-1 text-default-400">
                <FaRegCalendarAlt size={15} />
                <span>Joined {format(profileDetails.created_at, "MMMM yyyy")}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-default-400"><span className="text-foreground">{profileDetails.follows.followings.length}</span> Following</p>
              <p className="text-default-400"><span className="text-foreground">{profileDetails.follows.followers.length}</span> Followers</p>
            </div>
            {!sessionUser?.follows.followings.includes(parseInt(profileDetails.id.toString())) && (
              <p className="text-sm text-default-400">Not followed by anyone you&apos;re following</p>
            )}
          </div>
          <div className="mt-3">
            {profileDetails.id == sessionUser?.id! as number ? (
              <Button variant="bordered" className="font-bold text-base" radius="full" onClick={() => changeRoute(`/${profileDetails.username}/settings/profile`)}>
                Edit Profile
              </Button>
            ) : (
              <>
                {profileDetails.follows.followers.some(follower => follower == sessionUser?.id) ? (
                  <Button variant="bordered" className="font-bold text-base hover:border-danger/75 hover:bg-danger/20 hover:text-danger" radius="full" onPointerEnter={() => setFollowingText("Unfollow")} onPointerLeave={() => setFollowingText("Following")} onClick={hanldeUnfollow}>
                    {followingText}
                  </Button>
                ) : (
                  <Button onClick={hanldeFollow} color="secondary" className="font-bold text-base" radius="full">
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <Tabs
          size="lg"
          className="w-full border-b border-b-default"
          variant="underlined"
          color="primary"
          selectedKey={currentTab}
          classNames={{
            tabList: "w-full gap-0",
            tab: "data-[hover-unselected=true]:hover:bg-default-50 data-[hover-unselected=true]:opacity-100 h-14",
            tabContent: "group-data-[selected=true]:font-bold"
          }}
        >
          <Tab as={Link} className="hover:no-underline" key="posts" href={`/${profileDetails.username}`} title="Posts" />
          <Tab as={Link} className="hover:no-underline" key="replies" href={`/${profileDetails.username}/with_replies`} title="Replies" />
          <Tab as={Link} className="hover:no-underline" key="media" href={`/${profileDetails.username}/media`} title="Media" />
        </Tabs>
      </div>
    </div>
  )
}

export default UserProfile;
