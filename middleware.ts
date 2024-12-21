import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLoggedInUser } from "./lib/actions/user.actions";
import { routeAccessMap } from "./lib/settings";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", url));
    }

    const allowedRoles = Object.entries(routeAccessMap).find(([route]) =>
      new RegExp(`^${route}$`).test(url.pathname)
    )?.[1];

    if (!allowedRoles) {
      return NextResponse.next();
    }

    if (allowedRoles.includes(user.role)) {
      return NextResponse.next();
    } else {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    return NextResponse.rewrite(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/overview",
    "/list/:path*",
    "/doctor/:path*",
    "/patient/:path*",
  ],
};
