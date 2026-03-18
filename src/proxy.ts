import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/admin") && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
