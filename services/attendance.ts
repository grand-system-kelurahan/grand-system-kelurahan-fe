import type { TAttendanceForm } from "@/schemas/attendance-schema";

const baseUrl = process.env.NEXT_PUBLIC_API_ATTENDANCE || "http://localhost:8002";

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    try {
      return await res.text();
    } catch {
      return null;
    }
  }
}

export async function getAllAttendances() {
  const res = await fetch(`${baseUrl}/attendances`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch attendances");
  return parseJsonSafe(res);
}

export async function getAttendanceById(id: number) {
  const res = await fetch(`${baseUrl}/attendances/${id}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return parseJsonSafe(res);
}

export async function getAttendancesByEmployee(employeeId: number) {
  const res = await fetch(`${baseUrl}/attendances/employee/${employeeId}`, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch attendances by employee");
  return parseJsonSafe(res);
}

export async function createAttendance(payload: TAttendanceForm) {
  const res = await fetch(`${baseUrl}/attendances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create attendance failed");
  return parseJsonSafe(res);
}

export async function updateAttendance(params: { id: number; payload: Partial<TAttendanceForm> }) {
  const res = await fetch(`${baseUrl}/attendances/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.payload),
  });
  if (!res.ok) throw new Error("Update attendance failed");
  return parseJsonSafe(res);
}

export async function deleteAttendance(id: number) {
  const res = await fetch(`${baseUrl}/attendances/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete attendance failed");
  return parseJsonSafe(res);
}

export async function clockInAttendance(payload: { employee_id: number; time: string }) {
  const res = await fetch(`${baseUrl}/attendances/clock-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Clock-in failed");
  return parseJsonSafe(res);
}

export async function clockOutAttendance(payload: { employee_id: number; time: string }) {
  const res = await fetch(`${baseUrl}/attendances/clock-out`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Clock-out failed");
  return parseJsonSafe(res);
}
