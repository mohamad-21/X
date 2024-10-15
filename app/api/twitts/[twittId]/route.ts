import { getTwittById, getUserFollowersAndFollowings } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { twittId: string } }) {
  const twitt = await getTwittById(params.twittId);
  const follows = await getUserFollowersAndFollowings(twitt!.user_id)
  return NextResponse.json({ ...twitt, follows });
}