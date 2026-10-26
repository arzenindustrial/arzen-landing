"use client";
import { supabase, supabaseConfigured } from "./supabase";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function authHeader(): Promise<Record<string, string>> {
  if (!supabaseConfigured()) return {};
  const { data } = await supabase().auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parse(res: Response) {
  if (res.ok) return res.headers.get("content-type")?.includes("application/json") ? res.json() : res.blob();
  let msg = `Request failed (${res.status}).`;
  try {
    const j = await res.json();
    if (typeof j.detail === "string") msg = j.detail;
    else if (Array.isArray(j.detail)) msg = j.detail.map((d: any) => d.msg).join(" ");
  } catch {}
  throw new ApiError(res.status, msg);
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, "The Arzen API is not connected on this site yet.");
  const headers: Record<string, string> = { ...(await authHeader()), ...(init.headers as Record<string, string>) };
  if (init.body && !(init.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  return parse(res);
}

export async function download(path: string, filename: string): Promise<void> {
  const blob = (await api<Blob>(path)) as Blob;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
