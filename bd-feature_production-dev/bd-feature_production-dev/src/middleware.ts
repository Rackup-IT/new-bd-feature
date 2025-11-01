import { match } from "@formatjs/intl-localematcher";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

// Type definitions for locales
const locales = ["en", "bn"] as const;
export type Locales = (typeof locales)[number];
const defaultLocale: Locales = "en";
const localeCookieName = "NEXT_LOCALE";

// Protected routes that require approval
const protectedRoutes = [
  "/api/uploads",
  "/admin/dashboard",
  "/admin/posts",
  "/dashboard",
  "/admin/approvals",
];

// Helper to ensure type safety for match function
function safeMatch(
  languages: string[],
  locales: readonly string[],
  defaultLocale: Locales
): Locales {
  const result = match(languages, locales, defaultLocale);
  return locales.includes(result as Locales)
    ? (result as Locales)
    : defaultLocale;
}

// Enhanced locale detection with type safety
function getLocale(request: NextRequest): Locales {
  // Check cookie first for persistent locale
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locales)) {
    return cookieLocale as Locales;
  }

  // Fallback to Accept-Language header
  const acceptLanguage = request.headers.get("accept-language") || "";

  // Simple language parsing without Negotiator
  const languages = acceptLanguage
    ? acceptLanguage.split(",").map((lang) => {
        const [code] = lang.split(";");
        return code.trim();
      })
    : [];

  return safeMatch(languages, locales, defaultLocale);
}

// Helper to add locale to path with proper URL handling
function addLocaleToPath(pathname: string, locale: Locales): string {
  return pathname.startsWith("/")
    ? `/${locale}${pathname}`
    : `/${locale}/${pathname}`;
}

// Create localized URL with proper type handling
function createLocalizedURL(request: NextRequest, locale: Locales): URL {
  const { pathname, search } = request.nextUrl;
  const newPathname = addLocaleToPath(pathname, locale);
  return new URL(`${newPathname}${search}`, request.url);
}

// Enhanced middleware with Next.js 15+ features
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await getSession();
  const response = NextResponse.next();

  // Preserve original pathname in headers for downstream use
  response.headers.set("x-pathname", pathname);
  response.headers.set("x-original-url", request.url);

  // 1. Auth-related redirects (existing logic with enhancements)
  const isBecomeAuthorRoute =
    pathname === "/become-author" || pathname === "/become-author?type=sign-up";

  if (isBecomeAuthorRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/become-author", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user is root user (admin)
  const rootUserEmail = process.env.ROOT_USER_EMAIL;
  const isRootUser = rootUserEmail && session?.email === rootUserEmail;

  // If user is not approved and not root user, redirect to pending approval page
  if (session && !session.isApproved && !isRootUser && isProtectedRoute) {
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  // 2. Route group exclusions (existing logic with Next.js 15+ optimizations)
  const isRouteGroupRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/become-author") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/v1/author") ||
    pathname.startsWith("/pending-approval") ||
    pathname.startsWith("/api/v1/session");

  if (isRouteGroupRoute) {
    return response;
  }

  // 3. Locale handling with Next.js 15+ optimizations
  const pathHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathHasLocale) {
    // Set locale cookie if not present (persist user's locale choice)
    const currentLocale = locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (currentLocale && !request.cookies.has(localeCookieName)) {
      response.cookies.set(localeCookieName, currentLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
        httpOnly: true,
      });
    }
    return response;
  }

  // 4. Locale redirection with modern URL handling
  const locale = getLocale(request);
  const localizedUrl = createLocalizedURL(request, locale);

  // Use rewrite for client-side transitions when possible (Next.js 15+ feature)
  if (request.headers.get("x-nextjs-data") === "1") {
    return NextResponse.rewrite(localizedUrl, {
      request: {
        headers: new Headers(request.headers),
      },
    });
  }

  // Fallback to redirect for full page loads
  return NextResponse.redirect(localizedUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (_next/data, _next/static)
     * - Public files (_next/static, static)
     * - Internal Next.js paths (_next)
     * - Health check endpoint
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/health|api/v1/health).*)",
  ],
};
