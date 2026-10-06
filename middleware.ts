import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me");

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/gallery/:path*",
    "/admin/partners/:path*",
    "/admin/settings/:path*"
  ]
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("apg_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
  try {
    await jwtVerify(token, SECRET());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
