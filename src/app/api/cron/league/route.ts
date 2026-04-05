import { NextResponse } from "next/server";

// Vercel calls this endpoint every Monday at 00:00 UTC (vercel.json crons)
// It expects: Authorization: Bearer <CRON_SECRET>
export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-admin-secret": process.env.ADMIN_SECRET ?? "",
  };

  // 1. Promote / demote + reset sessions_week
  const advanceRes = await fetch(`${base}/api/leagues`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action: "advance" }),
  });
  const advanceData = await advanceRes.json().catch(() => ({ error: "parse error" }));

  // 2. Reassign rooms with new tier composition
  const reshuffleRes = await fetch(`${base}/api/leagues`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action: "reshuffle" }),
  });
  const reshuffleData = await reshuffleRes.json().catch(() => ({ error: "parse error" }));

  return NextResponse.json({ ok: true, advance: advanceData, reshuffle: reshuffleData });
}
