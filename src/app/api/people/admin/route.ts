import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminEmails() {
  return (process.env.HUB_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

  if (!token) {
    return NextResponse.json({ error: "Please sign in with an authorised management account." }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const allowedEmails = getAdminEmails();

  if (!url || !anonKey || !serviceKey || allowedEmails.length !== 3) {
    return NextResponse.json({ error: "The management dashboard has not been configured." }, { status: 503 });
  }

  const authClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);

  if (authError || !authData.user?.email) {
    return NextResponse.json({ error: "Your session is invalid or has expired. Please sign in again." }, { status: 401 });
  }

  if (!allowedEmails.includes(authData.user.email.toLowerCase())) {
    return NextResponse.json({ error: "This account is not authorised to view HUB responses." }, { status: 403 });
  }

  const adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await adminClient
    .from("hub_capability_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return NextResponse.json({ error: "The staff response register could not be loaded." }, { status: 500 });
  }

  return NextResponse.json(
    { submissions: data ?? [] },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
