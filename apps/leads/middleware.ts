import { NextResponse, type NextRequest } from "next/server";

function decodeBasicAuth(headerValue: string) {
  if (!headerValue.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(headerValue.slice(6));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const expectedUser = process.env.LEADS_BASIC_AUTH_USER;
  const expectedPassword = process.env.LEADS_BASIC_AUTH_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const credentials = authHeader ? decodeBasicAuth(authHeader) : null;

  if (
    credentials &&
    credentials.user === expectedUser &&
    credentials.password === expectedPassword
  ) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="GreenCity leads"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
