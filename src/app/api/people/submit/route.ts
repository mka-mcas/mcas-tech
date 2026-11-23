import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const submissionSchema = z.object({
  position: z.string().trim().min(2).max(120),
  staffCategory: z.enum(["Research staff", "Supporting staff"]),
  grade: z.string().trim().min(1).max(40),
  employmentStatus: z.enum(["Permanent", "Contract"]),
  serviceYears: z.enum(["Under 2 years", "2–5 years", "6–10 years", "11–15 years", "More than 15 years"]),
  responsibilities: z.string().trim().min(5).max(3000),
  currentProjects: z.string().max(3000).optional().default(""),
  expertise: z.array(z.string().max(120)).min(1).max(25),
  toolsMethods: z.string().max(3000).optional().default(""),
  underusedSkills: z.string().max(3000).optional().default(""),
  researchInterests: z.array(z.string().max(120)).min(1).max(25),
  emergingAreas: z.string().max(3000).optional().default(""),
  researchGaps: z.string().max(3000).optional().default(""),
  nextTwoYears: z.string().trim().min(10).max(3000),
  projectIdeas: z.string().max(3000).optional().default(""),
  developmentGoals: z.string().max(3000).optional().default(""),
  roadSafetyContribution: z.string().trim().min(10).max(3000),
  nationalProblem: z.string().max(3000).optional().default(""),
  collaboration: z.string().max(100).optional().default(""),
  assignmentReadiness: z.string().max(120).optional().default(""),
  supportNeeded: z.string().max(3000).optional().default(""),
  preservePractices: z.string().max(3000).optional().default(""),
  positiveChange: z.string().max(3000).optional().default(""),
  consent: z.literal(true),
  website: z.string().max(300).optional().default(""),
});

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || !process.env.HUB_RATE_LIMIT_SALT) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getClientFingerprint(request: Request) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const salt = process.env.HUB_RATE_LIMIT_SALT;
  if (!ip || !salt) return null;
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "Request origin is not permitted." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 40_000) {
    return NextResponse.json({ error: "The submitted response is too large." }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit a valid form response." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Some required answers are missing or invalid. Please review the form and try again." }, { status: 400 });
  }

  // Honeypot: automated submissions that populate this hidden field are silently discarded.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const supabase = getServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "The survey submission service is not configured yet." }, { status: 503 });
  }

  const fingerprint = getClientFingerprint(request);
  if (fingerprint) {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("hub_submission_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", fingerprint)
      .gte("created_at", cutoff);

    if (countError) {
      return NextResponse.json({ error: "The survey is temporarily unavailable. Please try again later." }, { status: 503 });
    }
    if ((count ?? 0) >= 4) {
      return NextResponse.json({ error: "A response has recently been submitted from this connection. Please contact the administrator if you need assistance." }, { status: 429 });
    }

    const { error: attemptError } = await supabase.from("hub_submission_attempts").insert({ ip_hash: fingerprint });
    if (attemptError) {
      return NextResponse.json({ error: "The survey is temporarily unavailable. Please try again later." }, { status: 503 });
    }
  }

  const answers = {
    position: parsed.data.position,
    staff_category: parsed.data.staffCategory,
    grade: parsed.data.grade,
    employment_status: parsed.data.employmentStatus,
    service_years: parsed.data.serviceYears,
    responsibilities: parsed.data.responsibilities,
    current_projects: parsed.data.currentProjects,
    expertise: parsed.data.expertise,
    tools_methods: parsed.data.toolsMethods,
    underused_skills: parsed.data.underusedSkills,
    research_interests: parsed.data.researchInterests,
    emerging_areas: parsed.data.emergingAreas,
    research_gaps: parsed.data.researchGaps,
    next_two_years: parsed.data.nextTwoYears,
    project_ideas: parsed.data.projectIdeas,
    development_goals: parsed.data.developmentGoals,
    road_safety_contribution: parsed.data.roadSafetyContribution,
    national_problem: parsed.data.nationalProblem,
    collaboration: parsed.data.collaboration,
    assignment_readiness: parsed.data.assignmentReadiness,
    support_needed: parsed.data.supportNeeded,
    preserve_practices: parsed.data.preservePractices,
    positive_change: parsed.data.positiveChange,
  };
  const { error } = await supabase.from("hub_capability_submissions").insert(answers);

  if (error) {
    return NextResponse.json({ error: "We could not save your response. Please try again or contact the survey administrator." }, { status: 500 });
  }

  // Old hashed rate-limit records are not useful after one day.
  await supabase
    .from("hub_submission_attempts")
    .delete()
    .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  return NextResponse.json({ ok: true }, { status: 201 });
}
