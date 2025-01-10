import { getUserNotifications } from "@/app/_lib/actions";
import { auth } from "@/app/_lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: 'user is not authorized' }, { status: 401 });
  const notifications = await getUserNotifications(session?.user.id);
  const newNotifications = notifications.filter(notif => notif.is_viewed === 0);

  return NextResponse.json(newNotifications);
}