import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "pegawai" | "user";

function readRoleFromCookie(request: NextRequest): Role | null {
  // Pilih salah satu format cookie yang kamu simpan:
  // 1) cookie role langsung: role=admin|pegawai|user
  const roleDirect = request.cookies.get("role")?.value as Role | undefined;
  if (roleDirect === "admin" || roleDirect === "pegawai" || roleDirect === "user") {
    return roleDirect;
  }

  // 2) cookie user JSON: user={"id":1,"name":"...","role":"admin"}
  const userRaw = request.cookies.get("user")?.value;
  if (!userRaw) return null;

  try {
    const u = JSON.parse(userRaw) as { role?: Role };
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

  const token = request.cookies.get("token")?.value; // token dari login
  const role = readRoleFromCookie(request);

  const isApi = pathname.startsWith("/api/");
  const isEmployees =
    pathname.startsWith("/admin/dashboard/employees") ||
    pathname === "/api/employees" ||
    pathname.startsWith("/api/employees/");

  // 1) wajib login untuk semua matcher
  if (!token || !role) {
    if (isApi) {
      return NextResponse.json(
        { success: false, message: "authentication failed" },
        { status: 401 }
      );
    }

    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) RBAC
  if (isEmployees) {
    if (role !== "admin") {
      if (isApi) {
        return NextResponse.json(
          { success: false, message: "forbidden" },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // selain employees: pegawai atau admin
  if (role !== "pegawai" && role !== "admin") {
    if (isApi) {
      return NextResponse.json(
        { success: false, message: "forbidden" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
