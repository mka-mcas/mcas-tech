import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { code?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Enter the shared access code." }, { status: 400 }); }
  const expected = process.env.HUB_FINDINGS_ACCESS_CODE;
  if (!expected) return NextResponse.json({ error: "HUB Findings has not been configured yet." }, { status: 503 });
  const supplied = (body.code ?? "").trim().replace(/^#/, "").toLowerCase();
  if (!supplied || supplied !== expected.trim().replace(/^#/, "").toLowerCase()) {
    return NextResponse.json({ error: "That access code is not recognised." }, { status: 403 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return NextResponse.json({ error: "The findings service is not configured." }, { status: 503 });
  const db = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await db.from("hub_capability_submissions").select("expertise,research_interests");
  if (error) return NextResponse.json({ error: "Shared findings could not be loaded." }, { status: 500 });
  const rows = data ?? [];
  const tally = (key: "expertise" | "research_interests") => {
    const counts = new Map<string, number>();
    rows.forEach(row => (row[key] ?? []).forEach((value: string) => counts.set(value, (counts.get(value) ?? 0) + 1)));
    return [...counts.entries()].filter(([, count]) => count >= 5).sort((a,b)=>b[1]-a[1]).map(([label,count])=>({label,count}));
  };
  return NextResponse.json({ findings: { total: rows.length, expertise: tally("expertise"), interests: tally("research_interests") } }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}
