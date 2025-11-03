import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

interface UserJwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'VOLUNTEER'; 
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

async function verifyToken(
  token: string | undefined
): Promise<UserJwtPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as UserJwtPayload;
  } catch (error) {
    return null;
  }
}

const publicPaths = ['/login', '/api/auth/login'];

const adminPaths = ['/admin', '/api/admin', '/api/grantors'];

const volunteerPaths = ['/volunteers', '/api/volunteer', '/api/event-registration', '/api/events', '/api/locations', '/api/orientations'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const user = await verifyToken(token);

  const loginUrl = new URL('/login', request.url);
  const isApiRoute = pathname.startsWith('/api');
  
  // unauthenticated users
  if (!user) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }    
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  //admin only routes
  const userRole = user.role;

  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (userRole !== 'ADMIN') {
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have admin privileges.' },
          { status: 403 }
        );
      }
      const dashboardUrl = new URL('/volunteers', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  //volunteer or admin users
  if (volunteerPaths.some((path) => pathname.startsWith(path))) {
    if (userRole !== 'VOLUNTEER' && userRole !== 'ADMIN') {
      if (isApiRoute) {
        return NextResponse.json(
          { error: 'Forbidden. You do not have access.' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(loginUrl);
    }
  }


  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-payload', JSON.stringify(user));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*', 
    '/volunteers/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
