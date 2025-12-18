import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "pegawai" | "user";

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

function readRoleFromCookie(request: NextRequest): Role | null {
  const roleDirect = request.cookies.get("role")?.value as Role | undefined;
  if (roleDirect === "admin" || roleDirect === "pegawai" || roleDirect === "user") return roleDirect;

  const userRaw = request.cookies.get("user")?.value;
  if (!userRaw) return null;

  try {
    const u = JSON.parse(safeDecode(userRaw)) as { role?: Role };
    if (u.role === "admin" || u.role === "pegawai" || u.role === "user") return u.role;
    return null;
  } catch {
    return null;
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/:path*"],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApi = pathname.startsWith("/api/");
  const token = request.cookies.get("token")?.value;
  const role = readRoleFromCookie(request);

  const isEmployees =
    pathname.startsWith("/admin/dashboard/employees") ||
    pathname === "/api/employees" ||
    pathname.startsWith("/api/employees/");

  if (!token || !role) {
    if (isApi) {
      return NextResponse.json({ success: false, message: "authentication failed" }, { status: 401 });
    }
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isEmployees) {
    if (role !== "admin") {
      if (isApi) {
        return NextResponse.json({ success: false, message: "forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (role !== "pegawai" && role !== "admin") {
    if (isApi) {
      return NextResponse.json({ success: false, message: "forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
