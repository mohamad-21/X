import { signupWithCredentials, signupWithOAuth } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const registerType = request.nextUrl.searchParams.get('type');

  if (registerType === 'credentials') {
    await signupWithCredentials(data)
  } else {
    await signupWithOAuth(data);
  }

  return NextResponse.json(data);
}