import { signinWithCredentials } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await signinWithCredentials({ email_username: 'wyattmohammad1371017@gmail.com', password: '123' });
  return NextResponse.redirect(`${process.env.AUTH_URL}/home`);
}