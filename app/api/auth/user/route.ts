import { getUserFollowersAndFollowings } from "@/app/_lib/actions";
import { query } from "@/app/_lib/db";
import { User } from "@/app/_lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id') || request.nextUrl.searchParams.get('email');
  if (!id) return NextResponse.json({ message: 'id or email needed' }, { status: 400 });
  const data = await query<User[]>("select * from users where id = ? or email = ?", [id, id]);

  if (!data.length) {
    return NextResponse.json({
      message: 'user not found',
    }, { status: 404 });
  }

  const userFollows = await getUserFollowersAndFollowings(data[0].id);
  return NextResponse.json({ ...data[0], follows: userFollows })
}