"use client";

import React, { FormEvent, useMemo, useState } from "react";

const expertiseOptions = [
  "Quantitative research and statistical analysis",
  "Qualitative research and interviews",
  "Survey and instrument development",
  "Experimental and field study design",
  "Human factors and behavioural research",
  "Motorcycle and rider safety",
  "Driver competency and training",
  "Road safety engineering",
  "Vehicle safety and ADAS",
  "AI, machine learning and predictive analytics",
  "Data analytics and visualisation",
  "Software, web and application development",
  "GIS and spatial analysis",
  "Policy research and evaluation",
  "Project management and stakeholder engagement",
  "Technical writing and scientific publication",
  "Training design and facilitation",
  "Other expertise",
];

const researchOptions = [
  "Driver behaviour, competency and performance",
  "Motorcycle safety and rider behaviour",
  "Human factors, perception and hazard detection",
  "Fatigue, distraction and cognitive performance",
  "Artificial intelligence and predictive road safety",
  "ADAS, vehicle technology and safety evaluation",
  "Connected and automated mobility",
  "Road infrastructure and forgiving roads",
  "Occupational, commercial and fleet safety",
  "Vulnerable road users",
  "Road safety data intelligence",
  "Enforcement, compliance and deterrence",
  "Post-crash analysis and injury prevention",
  "Training effectiveness, licensing and assessment",
  "Road safety policy and programme evaluation",
  "Emerging mobility and micromobility",
  "Other research areas",
];

const initialForm = {
  position: "",
  grade: "",
  employmentStatus: "",
  serviceYears: "",
  responsibilities: "",
  currentProjects: "",
  expertise: [] as string[],
  toolsMethods: "",
  underusedSkills: "",
  researchInterests: [] as string[],
  emergingAreas: "",
  researchGaps: "",
  nextTwoYears: "",
  projectIdeas: "",
  developmentGoals: "",
  roadSafetyContribution: "",
  nationalProblem: "",
  collaboration: "",
  assignmentReadiness: "",
  supportNeeded: "",
  preservePractices: "",
  positiveChange: "",
  consent: false,
  website: "",
};

type FormState = typeof initialForm;

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-200">
      {children} {required && <span className="text-sky-400">*</span>}
    </label>
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      maxLength={3000}
      className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
    />
  );
}

function ChoiceGrid({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (option: string, checked: boolean) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300 transition hover:border-slate-600">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(event) => onToggle(option, event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-sky-500"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-5 shadow-xl shadow-black/10 sm:p-7">
      <div className="mb-6 flex gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/10 font-mono text-sm font-bold text-sky-300">
          {number}
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export default function PeopleSurveyPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const sections = useMemo(() => [
    "Your professional profile",
    "Your capabilities",
    "Research interests",
    "Your next 1–2 years",
    "Your contribution to road safety",
    "Support and the way forward",
  ], []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleChoice = (key: "expertise" | "researchInterests", option: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      [key]: checked
        ? [...current[key], option]
        : current[key].filter((item) => item !== option),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!form.consent) {
      setError("Please confirm the information and confidentiality statement before submitting.");
      return;
    }
    if (form.expertise.length === 0 || form.researchInterests.length === 0) {
      setError("Please select at least one area of expertise and one research interest.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/people/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your response could not be submitted. Please try again.");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#070b12] px-5 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 text-center shadow-2xl sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-300">✓</div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300">Response received</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Thank you for contributing.</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-300">
            Your perspectives will help us understand the capabilities within the centre, identify new research opportunities and plan meaningful professional development.
          </p>
          <p className="mt-7 text-xs text-slate-500">You may now close this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070b12] px-4 pb-24 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-sky-400">MIROS · People & Research Intelligence</p>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Discovering our capabilities.<br />
            <span className="text-sky-400">Shaping what comes next.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            This exercise is an opportunity to share your professional strengths, interests, ideas and aspirations. We want to understand the expertise within our team, identify areas worth exploring and create opportunities for everyone to contribute to safer roads in Malaysia.
          </p>
          <div className="mt-6 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 text-sm leading-6 text-slate-300">
            <strong className="text-sky-300">Confidentiality notice.</strong> This form does not ask for your name, staff number, email address or unit. It does ask for your position/designation, grade, employment status and experience, so some responses may be recognisable from their details. Individual responses will be accessible only to the Head of Unit and the designated administrative officer, for capability mapping, project planning, research development and staff development. They are not intended for individual performance appraisal. Please do not include names or other personal identifiers in open-text answers.
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Estimated time: 8–10 minutes</span>
            <span>Fields marked <span className="text-sky-400">*</span> are required</span>
          </div>
        </header>

        <div className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">Questionnaire progress</span>
            <span className="font-mono text-xs text-sky-300">Section {step} of 6</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${(step / 6) * 100}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {sections.map((section, index) => (
              <button key={section} type="button" onClick={() => setStep(index + 1)} className={`rounded-lg px-2 py-2 text-left text-[10px] leading-4 transition ${step === index + 1 ? "bg-sky-500/15 text-sky-200" : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"}`}>
                <span className="mb-1 block font-mono">0{index + 1}</span>{section}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="hidden" aria-hidden="true">
            <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label>
          </div>

          {step === 1 && (
            <Section number="01" title="Your professional profile" description="A little context helps us understand the experience and capabilities represented across the team.">
              <div>
                <FieldLabel required>Current position / designation</FieldLabel>
                <input required value={form.position} onChange={(event) => update("position", event.target.value)} maxLength={120} placeholder="e.g. Research Officer, Assistant Research Officer" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500" />
              </div>
              <div>
                <FieldLabel required>Position grade</FieldLabel>
                <input required value={form.grade} onChange={(event) => update("grade", event.target.value)} maxLength={40} placeholder="Enter your current grade" className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel required>Employment status</FieldLabel>
                  <select required value={form.employmentStatus} onChange={(event) => update("employmentStatus", event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500">
                    <option value="">Select one</option><option>Permanent</option><option>Contract</option>
                  </select>
                </div>
                <div>
                  <FieldLabel required>Years of service</FieldLabel>
                  <select required value={form.serviceYears} onChange={(event) => update("serviceYears", event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500">
                    <option value="">Select one</option><option>Under 2 years</option><option>2–5 years</option><option>6–10 years</option><option>11–15 years</option><option>More than 15 years</option>
                  </select>
                </div>
              </div>
              <div><FieldLabel required>What are your main responsibilities at present?</FieldLabel><TextArea required value={form.responsibilities} onChange={(value) => update("responsibilities", value)} placeholder="Briefly describe the work you are primarily responsible for." /></div>
              <div><FieldLabel>Which projects, studies or initiatives are you currently contributing to?</FieldLabel><TextArea value={form.currentProjects} onChange={(value) => update("currentProjects", value)} placeholder="You may describe the project or its subject area. Do not include confidential project details." rows={3} /></div>
            </Section>
          )}

          {step === 2 && (
            <Section number="02" title="Your capabilities" description="Think broadly about what you know, what you have done and what you could bring to a future project.">
              <div><FieldLabel required>Which areas best describe your expertise or professional strengths?</FieldLabel><p className="mb-3 text-xs text-slate-500">Select all that apply.</p><ChoiceGrid options={expertiseOptions} selected={form.expertise} onToggle={(option, checked) => toggleChoice("expertise", option, checked)} /></div>
              <div><FieldLabel>What software, tools, equipment or research methods can you use confidently?</FieldLabel><TextArea value={form.toolsMethods} onChange={(value) => update("toolsMethods", value)} placeholder="e.g. R, SPSS, Python, GIS, video analysis, field instrumentation, interview methods, audit tools..." /></div>
              <div><FieldLabel>Do you have any skills or expertise that you feel are currently underutilised?</FieldLabel><TextArea value={form.underusedSkills} onChange={(value) => update("underusedSkills", value)} placeholder="Tell us about capabilities you would welcome an opportunity to use more often." rows={3} /></div>
            </Section>
          )}

          {step === 3 && (
            <Section number="03" title="Research interests and new frontiers" description="Help us see beyond our current project portfolio. We are interested in both established and emerging areas.">
              <div><FieldLabel required>Which areas of road safety research would you be interested in exploring?</FieldLabel><p className="mb-3 text-xs text-slate-500">Select all that apply, including areas outside your current experience.</p><ChoiceGrid options={researchOptions} selected={form.researchInterests} onToggle={(option, checked) => toggleChoice("researchInterests", option, checked)} /></div>
              <div><FieldLabel>Are there emerging technologies, disciplines or research methods you would like to learn more about?</FieldLabel><TextArea value={form.emergingAreas} onChange={(value) => update("emergingAreas", value)} placeholder="What would you like to explore or become proficient in?" rows={3} /></div>
              <div><FieldLabel>What research areas do you think our centre has yet to explore sufficiently?</FieldLabel><TextArea value={form.researchGaps} onChange={(value) => update("researchGaps", value)} placeholder="Where do you see an opportunity, an unanswered question or a gap in our current work?" /></div>
            </Section>
          )}

          {step === 4 && (
            <Section number="04" title="Your next 1–2 years" description="This is about your aspirations and the contribution you would like to make—not a performance target.">
              <div><FieldLabel required>Looking ahead over the next one to two years, how do you envision your professional contribution in terms of research, projects, innovation, technical development or other initiatives relevant to the centre's objectives and MIROS KPIs?</FieldLabel><TextArea required value={form.nextTwoYears} onChange={(value) => update("nextTwoYears", value)} placeholder="Describe what you hope to work on, develop, lead, support or achieve." rows={6} /></div>
              <div><FieldLabel>Are there specific research ideas, project proposals or initiatives you would like to pursue?</FieldLabel><TextArea value={form.projectIdeas} onChange={(value) => update("projectIdeas", value)} placeholder="An early-stage idea is welcome. It does not need to be a fully developed proposal." /></div>
              <div><FieldLabel>What new skills, qualifications or professional competencies would you like to develop?</FieldLabel><TextArea value={form.developmentGoals} onChange={(value) => update("developmentGoals", value)} placeholder="e.g. advanced statistical methods, programming, instrumentation, research leadership, technical certification..." rows={3} /></div>
            </Section>
          )}

          {step === 5 && (
            <Section number="05" title="Your contribution to Malaysian road safety" description="We want to connect the work of our centre with the wider road safety challenges facing the country.">
              <div><FieldLabel required>How do you see yourself contributing to the improvement of road safety in Malaysia through your knowledge, expertise, experience or future initiatives?</FieldLabel><TextArea required value={form.roadSafetyContribution} onChange={(value) => update("roadSafetyContribution", value)} placeholder="Think about the contribution you would like your work to make." rows={6} /></div>
              <div><FieldLabel>In your opinion, what is one important road safety problem in Malaysia that deserves greater research attention, and how could our centre contribute towards addressing it?</FieldLabel><TextArea value={form.nationalProblem} onChange={(value) => update("nationalProblem", value)} placeholder="Describe the problem and, if possible, suggest a research or practical response." rows={5} /></div>
            </Section>
          )}

          {step === 6 && (
            <Section number="06" title="Support and the way forward" description="Help us understand what would enable you and the team to do meaningful work.">
              <div><FieldLabel>What opportunities, resources or support would help you develop your capabilities?</FieldLabel><TextArea value={form.supportNeeded} onChange={(value) => update("supportNeeded", value)} placeholder="Training, mentoring, equipment, access to data, collaboration, protected research time..." rows={3} /></div>
              <div>
                <FieldLabel>Would you be interested in collaborating on projects beyond your current area of work?</FieldLabel>
                <select value={form.collaboration} onChange={(event) => update("collaboration", event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"><option value="">Select one</option><option>Yes, definitely</option><option>Yes, depending on the project</option><option>Maybe, I would like to know more</option><option>Not at this time</option></select>
              </div>
              <div>
                <FieldLabel>How would you describe your willingness to take on a new project or responsibility?</FieldLabel>
                <select value={form.assignmentReadiness} onChange={(event) => update("assignmentReadiness", event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"><option value="">Select one</option><option>Available and interested</option><option>Interested, subject to current workload</option><option>Interested in a supporting role</option><option>Prefer to focus on current responsibilities for now</option></select>
              </div>
              <div><FieldLabel>Are there existing practices, arrangements or strengths within the team that you believe we should preserve?</FieldLabel><TextArea value={form.preservePractices} onChange={(value) => update("preservePractices", value)} placeholder="What is already working well and should continue?" rows={3} /></div>
              <div><FieldLabel>What is one positive change or initiative you would personally like to contribute to the centre?</FieldLabel><TextArea value={form.positiveChange} onChange={(value) => update("positiveChange", value)} placeholder="It can be a small improvement or a more ambitious idea." rows={3} /></div>
              <label className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
                <input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-sky-500" />
                <span>I understand the purpose and confidentiality arrangements described above. I agree to submit these responses for capability mapping, research planning, project development and staff development within the centre.</span>
              </label>
            </Section>
          )}

          {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}

          <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button type="button" disabled={step === 1 || submitting} onClick={() => { setStep((current) => Math.max(1, current - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-30">Previous section</button>
            {step < 6 ? (
              <button type="button" onClick={() => { setStep((current) => Math.min(6, current + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-xl bg-sky-500 px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400">Continue to {sections[step]}</button>
            ) : (
              <button type="submit" disabled={submitting} className="rounded-xl bg-sky-500 px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60">{submitting ? "Submitting response…" : "Submit my response"}</button>
            )}
          </div>
          <p className="text-center text-[11px] leading-5 text-slate-600">Please do not include names, staff numbers, email addresses, unit names or confidential information in your written responses.</p>
        </form>
      </div>
    </main>
  );
}
