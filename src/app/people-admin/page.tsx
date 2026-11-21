"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

type Submission = {
  id: string;
  created_at: string;
  position: string;
  staff_category: string;
  grade: string;
  employment_status: string;
  service_years: string;
  responsibilities: string;
  current_projects: string | null;
  expertise: string[];
  tools_methods: string | null;
  underused_skills: string | null;
  research_interests: string[];
  emerging_areas: string | null;
  research_gaps: string | null;
  next_two_years: string;
  project_ideas: string | null;
  development_goals: string | null;
  road_safety_contribution: string;
  national_problem: string | null;
  collaboration: string | null;
  assignment_readiness: string | null;
  support_needed: string | null;
  preserve_practices: string | null;
  positive_change: string | null;
};

function Detail({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="border-t border-slate-800 pt-4 first:border-0 first:pt-0">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => <span key={item} className="rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs text-sky-200">{item}</span>)}
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{value}</p>
      )}
    </div>
  );
}

export default function PeopleAdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorised, setAuthorised] = useState(false);

  const loadResponses = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseClient();
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (sessionError || !token) {
        setAuthorised(false);
        setError("Please sign in using the existing MCAS.tech Portal before opening the management dashboard.");
        return;
      }

      const response = await fetch("/api/people/admin", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        setAuthorised(false);
        setError(result.error || "You are not authorised to view this dashboard.");
        return;
      }
      setSubmissions(result.submissions ?? []);
      setAuthorised(true);
    } catch {
      setError("The dashboard could not connect to the management service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadResponses();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return submissions;
    return submissions.filter((item) => [
      item.position, item.staff_category, item.grade, item.employment_status, item.service_years,
      item.responsibilities, item.current_projects, item.expertise.join(" "),
      item.tools_methods, item.underused_skills, item.research_interests.join(" "),
      item.emerging_areas, item.research_gaps, item.next_two_years, item.project_ideas,
      item.development_goals, item.road_safety_contribution, item.national_problem,
      item.collaboration, item.assignment_readiness, item.support_needed,
      item.preserve_practices, item.positive_change,
    ].join(" ").toLowerCase().includes(query));
  }, [submissions, search]);

  const uniqueInterests = useMemo(() => {
    const counts = new Map<string, number>();
    submissions.forEach((item) => item.research_interests.forEach((interest) => counts.set(interest, (counts.get(interest) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [submissions]);

  return (
    <main className="min-h-screen bg-[#070b12] px-4 pb-20 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400">Restricted management workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">People & Research Intelligence</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Individual staff capability profiles and the emerging research interests of the centre.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void loadResponses()} disabled={loading} className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white disabled:opacity-50">{loading ? "Refreshing…" : "Refresh responses"}</button>
            <Link href="/people-survey" className="rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400">Open survey</Link>
          </div>
        </header>

        <div className="mb-7 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-6 text-amber-100/80">
          Confidential staff information. Access is restricted to accounts explicitly authorised by the server-side administrator allowlist. Do not download, forward or reuse individual responses outside the stated workforce-planning and research-development purposes.
        </div>

        {loading && <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center text-sm text-slate-400">Loading management workspace…</div>}

        {!loading && error && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <h2 className="text-lg font-bold text-white">{error.includes("not authorised") ? "Access restricted" : "Management sign-in required"}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{error}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/auth/login" className="rounded-xl bg-sky-500 px-5 py-3 text-xs font-bold text-slate-950 hover:bg-sky-400">Go to MCAS.tech Portal</Link>
              <button onClick={() => void loadResponses()} className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white">Try again</button>
            </div>
          </div>
        )}

        {!loading && authorised && (
          <>
            <section className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Submitted profiles</p><p className="mt-2 text-3xl font-black text-white">{submissions.length}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Permanent staff</p><p className="mt-2 text-3xl font-black text-white">{submissions.filter((item) => item.employment_status === "Permanent").length}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Contract staff</p><p className="mt-2 text-3xl font-black text-white">{submissions.filter((item) => item.employment_status === "Contract").length}</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-xs text-slate-500">Distinct research interests</p><p className="mt-2 text-3xl font-black text-white">{uniqueInterests.length}</p></div>
            </section>

            <section className="mb-7 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <h2 className="font-bold text-white">Research interest signals</h2>
                <p className="mb-5 mt-1 text-xs text-slate-500">Number of staff selecting each research area.</p>
                <div className="space-y-3">
                  {uniqueInterests.slice(0, 8).map(([interest, count]) => (
                    <div key={interest}>
                      <div className="mb-1 flex justify-between gap-3 text-xs"><span className="text-slate-300">{interest}</span><span className="font-mono text-sky-300">{count}</span></div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-500" style={{ width: `${submissions.length ? (count / submissions.length) * 100 : 0}%` }} /></div>
                    </div>
                  ))}
                  {uniqueInterests.length === 0 && <p className="text-sm text-slate-500">No research interest responses yet.</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <h2 className="font-bold text-white">Employment profile</h2>
                <p className="mb-5 mt-1 text-xs text-slate-500">Distribution of submitted responses.</p>
                {["Permanent", "Contract"].map((status) => {
                  const count = submissions.filter((item) => item.employment_status === status).length;
                  return <div key={status} className="mb-4"><div className="mb-1 flex justify-between text-xs"><span className="text-slate-300">{status}</span><span className="font-mono text-slate-300">{count}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${status === "Permanent" ? "bg-emerald-500" : "bg-violet-400"}`} style={{ width: `${submissions.length ? (count / submissions.length) * 100 : 0}%` }} /></div></div>;
                })}
                <p className="mt-5 text-[11px] leading-5 text-slate-500">This dashboard reflects survey participation, not necessarily the full composition of the workforce.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div><h2 className="text-lg font-bold text-white">Individual capability profiles</h2><p className="mt-1 text-xs text-slate-500">Select a profile to review its full response.</p></div>
                <div className="text-xs text-slate-500">{filtered.length} of {submissions.length} profiles</div>
              </div>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search designation, grade, expertise, research interests or responses…" className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500" />
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item)} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-left transition hover:border-sky-500/50 hover:bg-slate-950">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-white">{item.position}</p><p className="mt-1 text-xs text-slate-500">{item.staff_category} · Grade {item.grade} · {item.employment_status} · {item.service_years}</p></div>
                      <span className="rounded-md border border-slate-700 px-2 py-1 font-mono text-[10px] text-slate-500">P-{item.id.slice(0, 6).toUpperCase()}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">{item.expertise.slice(0, 3).map((skill) => <span key={skill} className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] text-sky-200">{skill}</span>)}</div>
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-400">{item.next_two_years}</p>
                    <p className="mt-3 text-[10px] text-slate-600">Submitted {new Date(item.created_at).toLocaleDateString()}</p>
                  </button>
                ))}
              </div>
              {filtered.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No matching profiles found.</p>}
            </section>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Staff capability profile" onClick={() => setSelected(null)}>
          <div className="mx-auto my-6 max-w-3xl rounded-2xl border border-slate-700 bg-[#0b1220] p-5 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-400">Individual capability profile · P-{selected.id.slice(0, 6).toUpperCase()}</p><h2 className="mt-2 text-2xl font-black text-white">{selected.position}</h2><p className="mt-1 text-xs text-slate-400">Grade {selected.grade} · {selected.employment_status} · {selected.service_years}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white">Close</button>
            </div>
            <div className="space-y-5">
              <Detail label="Main responsibilities" value={selected.responsibilities} />
              <Detail label="Current project involvement" value={selected.current_projects} />
              <Detail label="Expertise and strengths" value={selected.expertise} />
              <Detail label="Tools, software and methods" value={selected.tools_methods} />
              <Detail label="Underutilised capabilities" value={selected.underused_skills} />
              <Detail label="Research interests" value={selected.research_interests} />
              <Detail label="Emerging areas to explore" value={selected.emerging_areas} />
              <Detail label="Research gaps identified" value={selected.research_gaps} />
              <Detail label="Vision for the next 1–2 years" value={selected.next_two_years} />
              <Detail label="Project ideas" value={selected.project_ideas} />
              <Detail label="Development goals" value={selected.development_goals} />
              <Detail label="Contribution to Malaysian road safety" value={selected.road_safety_contribution} />
              <Detail label="National road safety problem identified" value={selected.national_problem} />
              <Detail label="Cross-project collaboration" value={selected.collaboration} />
              <Detail label="Readiness for new assignments" value={selected.assignment_readiness} />
              <Detail label="Support needed" value={selected.support_needed} />
              <Detail label="Practices worth preserving" value={selected.preserve_practices} />
              <Detail label="Positive change proposed" value={selected.positive_change} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
