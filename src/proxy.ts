import { NextResponse, type NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

const STATIC_FILE = /\.[a-z0-9]+$/i;

function isPassthrough(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    STATIC_FILE.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPassthrough(pathname)) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = siteConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = siteConfig.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
