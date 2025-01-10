export { auth as middleware } from "@/app/_lib/auth";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}