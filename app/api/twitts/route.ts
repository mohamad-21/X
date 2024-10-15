import { getAlltwitts } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const include_replies = request.nextUrl.searchParams.get('include_replies');
  const twitts = await getAlltwitts();
  return NextResponse.json((include_replies && include_replies === 'false') ? twitts.filter(twitt => twitt.reply_to === null) : twitts);
}