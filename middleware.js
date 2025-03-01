import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/api/authMiddleware"
import { logMiddleware } from "./middlewares/api/logMiddleware"

export const config = {
    matcher: "/api/:path*"
}

export default function middleware(request) {
    if (
      request.url.includes("/api/auth/login") ||
      request.url.includes("/api/auth/signup") 
    ) {
      return NextResponse.next();
    }

    if (request.url.includes("/api/auth/dashboard/:path*")) {
      const logResult = logMiddleware(request);
      console.log(logResult.response);
    }

    const authResult = authMiddleware(request)
    if (!authResult.isValid) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorization" }),
          {
            status: 401,
          }
        );
    }
    return NextResponse.next();
}