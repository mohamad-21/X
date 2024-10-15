import { getUserById } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');
    const include_replies = request.nextUrl.searchParams.get('include_replies');
    if (!userId) return NextResponse.json({ message: 'id parameter is not set' }, { status: 400 });
    const user = await getUserById(userId, true);

    if (!user) {
      return NextResponse.json({
        message: 'user not found'
      }, { status: 404 });
    }

    const twitts = (include_replies && include_replies === 'false') ? user.twitts.filter(twitt => twitt.reply_to === null) : user.twitts;

    return NextResponse.json(twitts);
  } catch (err) {
    return NextResponse.json({
      message: 'internal server error'
    }, { status: 500 });
  }
}