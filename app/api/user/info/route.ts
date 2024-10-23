import { getUserBookmarks, getUserById, getUserFollowersAndFollowings } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');
    const twittsType = request.nextUrl.searchParams.get('twitts_type') || '';
    const fullData = request.nextUrl.searchParams.get('full_data') || '';
    if (!userId) return NextResponse.json({ message: 'id parameter is not set' }, { status: 400 });
    const user = await getUserById(userId, { twittsWithReply: twittsType === 'with_reply', mediaOnly: twittsType === 'media_only' });
    if (!user) {
      return NextResponse.json({
        message: 'user not found'
      }, { status: 404 });
    }
    if (fullData !== 'false') {
      const [follows, bookmarks] = await Promise.all([
        getUserFollowersAndFollowings(user.id),
        getUserBookmarks(user.id)
      ]);
      return NextResponse.json({ ...user, follows, bookmarks });
    }


    const follows = await getUserFollowersAndFollowings(user.id);
    return NextResponse.json({ ...user, follows: follows });
  } catch (err) {
    return NextResponse.json({
      message: 'internal server error'
    }, { status: 500 });
  }
}