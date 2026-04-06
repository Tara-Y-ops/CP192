import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/auth", request.url), 303);
  clearSessionCookie(response);
  return response;
}
