export type Role = "admin" | "pegawai" | "user";

function isSecure() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

export function setCookie(name: string, value: string, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${
    isSecure() ? "; Secure" : ""
  }`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length < 2) return null;
  return parts.pop()!.split(";").shift() ?? null;
}

export function getCookieDecoded(name: string): string | null {
  const raw = getCookie(name);
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearAuthCookies() {
  removeCookie("token");
  removeCookie("role");
  removeCookie("user");
}

export function getTokenDecoded(): string | null {
  return getCookieDecoded("token");
}

export function setUserCookies(user: any) {
  const role = user?.role as Role | undefined;
  if (role) setCookie("role", role, 7);
  setCookie("user", JSON.stringify(user), 7);
}
