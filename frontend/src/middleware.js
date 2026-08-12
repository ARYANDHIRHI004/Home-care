import { NextResponse } from "next/server";

/**
 * Better Auth sets a session cookie named "better-auth.session_token"
 * (or "__Secure-better-auth.session_token" in production over HTTPS).
 * We check for its presence to decide whether a request is authenticated.
 */
const SESSION_COOKIE = "better-auth.session_token";
const SESSION_COOKIE_SECURE = "__Secure-better-auth.session_token";

/** Routes that require the user to be an authenticated office/admin user. */
const PROTECTED_OFFICE_ROUTES = ["/office"];

/** Routes that authenticated users should be bounced away from. */
const AUTH_ROUTES = ["/login/office"];

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check for a session cookie (present = some session exists)
    const hasSession =
        request.cookies.has(SESSION_COOKIE) ||
        request.cookies.has(SESSION_COOKIE_SECURE);

    // ── Protect /office/** ────────────────────────────────────────────────────
    const isOfficePath = PROTECTED_OFFICE_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (isOfficePath && !hasSession) {
        const loginUrl = new URL("/login/office", request.url);
        // Preserve the intended destination so we can redirect after login
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Redirect authenticated users away from login pages ───────────────────
    const isAuthPath = AUTH_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    if (isAuthPath && hasSession) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         *  - _next/static (static files)
         *  - _next/image  (image optimisation)
         *  - favicon.ico
         *  - public files (images, fonts, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
    ],
};