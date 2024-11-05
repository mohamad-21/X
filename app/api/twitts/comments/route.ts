import { getAlltwitts, getTwittComments } from "@/app/_lib/actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ message: 'id parameter is not set' });
  }
  const twitts = await getTwittComments(id);
  return NextResponse.json(twitts);
}