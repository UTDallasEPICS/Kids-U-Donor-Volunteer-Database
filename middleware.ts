import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface UserJwtPayload {
  userId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VOLUNTEER";
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

const secretKey = new TextEncoder().encode(JWT_SECRET);

const roleHome: Record<UserJwtPayload["role"], string> = {
  VOLUNTEER: "/volunteers",
  ADMIN: "/admin",
  SUPER_ADMIN: "/super-admin",
};

async function verifyToken(token?: string): Promise<UserJwtPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    const user = payload as unknown as Partial<UserJwtPayload>;
    if (!user.userId || !user.email || !user.role) {
      return null;
    }
    return user as UserJwtPayload;
  } catch {
    return null;
  }
}

const publicPaths = [
  "/",
  "/signup",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/emailverify",
  "/verification/verify-email",
  "/verification/verify-2fa",
  "/verification/forgot-password",
  "/verification/reset-password",
];

const routePermissions = [
  {
    paths: ["/super-admin", "/api/super-admin"],
    allowedRoles: ["SUPER_ADMIN"] as const,
  },
  {
    paths: ["/admin", "/api/admin", "/api/grantors"],
    allowedRoles: ["ADMIN", "SUPER_ADMIN"] as const,
  },
  {
    paths: ["/volunteers"],
    allowedRoles: ["VOLUNTEER"] as const,
  },
  {
    paths: [
      "/api/volunteer",
      "/api/event-registration",
      "/api/events",
      "/api/locations",
      "/api/orientations",
      "/api/background-check",
    ],
    allowedRoles: ["VOLUNTEER", "ADMIN", "SUPER_ADMIN"] as const,
  },
] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api");

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const user = await verifyToken(token);

  if (!user) {
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL("/", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  for (const route of routePermissions) {
    if (
      route.paths.some((p) => pathname.startsWith(p)) &&
      !(route.allowedRoles as readonly string[]).includes(user.role)
    ) {
      if (isApi) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.redirect(new URL(roleHome[user.role], request.url));
    }
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-payload", JSON.stringify(user));

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/volunteers/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
