import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export function proxy(request: NextRequest) {
  const { userId } = getAuth(request);

  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/webhook",
    "/question/",
    "/tags",
    "/profile/",
    "/community",
    "/jobs",
  ];

  const isPublic = publicRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If route is public, just continue
  if (isPublic) {
    return NextResponse.next();
  }

  // If user is authenticated, set cookie and continue
  if (userId) {
    const response = NextResponse.next();
    response.cookies.set("userId", userId, { path: "/" });
    return response;
  }

  // Otherwise, redirect to sign-in
  return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
