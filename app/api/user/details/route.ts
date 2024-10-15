import { getUserById, getUserFollowersAndFollowings } from "@/app/_lib/actions";
import { User } from "@/app/_lib/definitions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('id');
    if (!userId) return NextResponse.json({ message: 'id parameter is not set' }, { status: 400 });
    const [user, follows] = await Promise.all([
      getUserById(userId),
      getUserFollowersAndFollowings(userId)
    ]);

    if (!user) {
      return NextResponse.json({
        message: 'user not found'
      }, { status: 404 });
    }

    const userInfo: User = {
      id: user.id,
      name: user.name,
      username: user.username,
      password: '',
      email: user.email,
      bio: user.bio,
      website: user.website,
      location: user.location,
      header_photo: user.header_photo,
      profile: user.profile,
      birthday: user.birthday,
      created_at: user.created_at.toString(),
      updated_at: user.updated_at.toString(),
    };

    return NextResponse.json({ ...userInfo, follows });
  } catch (err) {
    return NextResponse.json({
      message: 'internal server error'
    }, { status: 500 });
  }
}