"use client";

import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Mic2,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset
} from "lucide-react";

type DrillDay = {
  day: string;
  title: string;
  objective: string;
  drills: string[];
  proof: string;
};

type DrillGroup = {
  title: string;
  signal: string;
  questions: string[];
};

type AnswerFrame = {
  title: string;
  useFor: string;
  steps: string[];
};

type PreparationIntro = {
  title: string;
  script: string;
  likelyFollowUps: string[];
};

const dailyRhythm = [
  { label: "Recall", minutes: "25m", detail: "Answer from memory before reading notes." },
  { label: "Drill", minutes: "55m", detail: "Practice 6-8 questions out loud with a timer." },
  { label: "Whiteboard", minutes: "45m", detail: "Draw flows, data paths, bottlenecks, and failure cases." },
  { label: "Record", minutes: "20m", detail: "Record one answer, score clarity, cut rambling." },
  { label: "Repair", minutes: "15m", detail: "Patch weak facts, metrics, and trade-off language." }
];

const preparationIntros: PreparationIntro[] = [
  {
    title: "30-second preparation intro",
    script:
      "I structured my preparation around my resume instead of studying random topics. For each major bullet, I prepared the context, what I owned, the metric, and the follow-up questions I may get. My main focus areas are Java/Spring backend work, payroll and event processing, SQL performance tuning, Oracle HCM modernization, and explaining my independent projects clearly.",
    likelyFollowUps: [
      "Which bullet did you spend the most time preparing?",
      "Where do you still feel less confident?",
      "Which resume bullet are you most confident defending?"
    ]
  },
  {
    title: "90-second preparation intro",
    script:
      "I broke my preparation into three parts. First, I made each resume line defendable: context, problem, my change, result, trade-off, and what I would improve now. Second, I practiced technical follow-ups around the work I actually claim: Java/Spring API design, batch and event processing, SQL query tuning, PL/SQL, execution plans, and system-design discussions from payroll and my projects. Third, I practiced answering out loud and trimming anything that sounded unsupported or too broad. My goal is to be accurate and clear, not to sound like I know every tool deeply.",
    likelyFollowUps: [
      "Give me an example of a claim you decided to keep modest.",
      "What was hardest to explain clearly?",
      "What would you improve in one of these systems?"
    ]
  },
  {
    title: "If asked: how did you prepare for this company?",
    script:
      "I prepared by reading the role signals and matching them to real parts of my experience. For this role, I would connect backend ownership, reliability, database performance, API design, and communication to examples from my resume. I also prepared follow-up paths so if the interviewer turns a resume point into a design question, I can explain data flow, bottlenecks, failure cases, and trade-offs without using buzzwords.",
    likelyFollowUps: [
      "What part of this role maps best to your experience?",
      "Which system would you redesign from your past work?",
      "What trade-off from your resume would you explain first?"
    ]
  }
];

const drillDays: DrillDay[] = [
  {
    day: "Day 01",
    title: "Resume truth map",
    objective: "Turn every resume line into a defensible story, metric, and follow-up path.",
    drills: [
      "Read the resume aloud and mark every claim that can trigger a follow-up.",
      "Write a one-sentence proof for each metric: 25%, 4x, 10K+ events/hour.",
      "Create a do-not-overclaim list for tools where depth is limited."
    ],
    proof: "One annotated resume with proof notes beside every bullet."
  },
  {
    day: "Day 02",
    title: "Opening narrative",
    objective: "Make the first five minutes calm, senior, and consistent.",
    drills: [
      "Prepare 45-second, 90-second, and 2-minute versions of 'Tell me about yourself.'",
      "Prepare 30-second and 90-second answers for 'How did you prepare for this interview?'",
      "Practice transitions from Samsung to Oracle and from backend work to product projects.",
      "Prepare a clean answer for relocation, role preference, and why now."
    ],
    proof: "Three recorded intros, each under its target time."
  },
  {
    day: "Day 03",
    title: "Oracle payroll event engine",
    objective: "Defend the Java thread-pool, batching, throughput, and reliability story.",
    drills: [
      "Draw the payroll event processing flow from event intake to downstream processing.",
      "Explain why thread-pool sizing, queue depth, and batch size affect throughput.",
      "Answer how 25% improvement was measured and what bottleneck remained."
    ],
    proof: "One architecture sketch plus a 2-minute optimization story."
  },
  {
    day: "Day 04",
    title: "Spring API design",
    objective: "Answer API follow-ups around versioning, pagination, idempotency, errors, and contracts.",
    drills: [
      "Design a payroll events endpoint with request, response, errors, and pagination.",
      "Explain idempotency for retries and duplicate event submission.",
      "Practice trade-offs between synchronous APIs and async processing."
    ],
    proof: "One API contract written as if explaining to an interviewer."
  },
  {
    day: "Day 05",
    title: "SQL and PL/SQL performance",
    objective: "Make the 4x performance story technically credible.",
    drills: [
      "Explain EXPLAIN PLAN, AWR, cardinality, indexes, joins, and bind variables simply.",
      "Prepare one slow-query story: symptom, evidence, change, measurement, rollback plan.",
      "Practice when not to add an index because of write cost or low selectivity."
    ],
    proof: "One before/after query-tuning narrative with exact diagnostic steps."
  },
  {
    day: "Day 06",
    title: "HCM UI modernization",
    objective: "Connect ADF, stateless services, Oracle JET, VBCS, validation, and UX performance.",
    drills: [
      "Explain what changed when logic moved from managed beans toward stateless services.",
      "Prepare a lazy-loading and asynchronous validation example.",
      "Practice the answer to 'How did you avoid breaking existing HCM workflows?'"
    ],
    proof: "One modernization story using risk, rollout, and regression checks."
  },
  {
    day: "Day 07",
    title: "Delivery and quality",
    objective: "Show ownership beyond coding: Docker, CI/CD, reviews, testing, and release safety.",
    drills: [
      "Explain what containerization improved and what it did not solve.",
      "Prepare examples for JUnit, Mockito, code review, and design-pattern discussions.",
      "Answer 'Tell me about a production risk you reduced.'"
    ],
    proof: "Five crisp quality answers, each under 75 seconds."
  },
  {
    day: "Day 08",
    title: "Samsung Android charging",
    objective: "Make kernel, Time-To-Full, logs, and hardware debugging understandable.",
    drills: [
      "Explain Time-To-Full in product terms, then in technical terms.",
      "Describe the boundary between kernel logic, charging IC signals, logs, and UI behavior.",
      "Practice a debugging story without overusing hardware jargon."
    ],
    proof: "One plain-English explanation and one technical explanation."
  },
  {
    day: "Day 09",
    title: "Market Narrative architecture",
    objective: "Defend the strongest independent project as a backend-heavy system.",
    drills: [
      "Draw ingestion, clustering, technical scanning, admin review, cache, and public archive flow.",
      "Explain why PostgreSQL partitions and Redis caching fit the read/write patterns.",
      "Prepare answers for accuracy, source traceability, failures, and operating cost."
    ],
    proof: "One system-design walkthrough from raw signal to published narrative."
  },
  {
    day: "Day 10",
    title: "The Win List product story",
    objective: "Talk about the live app without making commit history the evidence.",
    drills: [
      "Explain the product problem and local-first behavior without leaning on repository depth.",
      "Prepare why optional Supabase sync helps without making the cloud mandatory.",
      "Answer privacy and analytics questions around daily notes and consent boundaries."
    ],
    proof: "One product demo script focused on behavior, not GitHub history."
  },
  {
    day: "Day 11",
    title: "Diagnostics analyzer",
    objective: "Use the Java diagnostics project to reinforce performance instincts.",
    drills: [
      "Explain what logs, SQL latencies, thread usage, and memory patterns reveal.",
      "Prepare an AWR-style summary example and how a developer would act on it.",
      "Answer how scheduled anomaly detection would avoid noise."
    ],
    proof: "One diagnostic report outline with inputs, outputs, and actions."
  },
  {
    day: "Day 12",
    title: "System-design follow-ups",
    objective: "Prepare for interviewers who convert resume bullets into design prompts.",
    drills: [
      "Design a payroll event processor for 10x current volume.",
      "Design a market briefing pipeline with retries, dedupe, and auditability.",
      "Design optional sync for a local-first habit app."
    ],
    proof: "Three whiteboard diagrams with bottlenecks and failure boundaries."
  },
  {
    day: "Day 13",
    title: "Behavioral and seniority signals",
    objective: "Turn ownership, conflict, ambiguity, and mentoring into structured answers.",
    drills: [
      "Prepare stories for disagreement, missed estimate, production issue, mentoring, and trade-off reversal.",
      "Use the same facts but vary the lesson for leadership, quality, and communication.",
      "Practice concise endings: what changed afterward?"
    ],
    proof: "Ten STAR stories, each with a measurable or concrete ending."
  },
  {
    day: "Day 14",
    title: "Full resume mock loop",
    objective: "Simulate a real drill round and remove hesitation.",
    drills: [
      "Run a 60-minute mock: intro, Oracle deep dive, SQL, Samsung, projects, behavior.",
      "Mark every answer red, yellow, or green.",
      "Rewrite weak answers into 6-sentence versions."
    ],
    proof: "Final answer sheet and a list of five topics to review weekly."
  }
];

const drillGroups: DrillGroup[] = [
  {
    title: "Opening and career narrative",
    signal: "Calm senior positioning",
    questions: [
      "Walk me through your resume.",
      "Why did you move from Samsung to Oracle?",
      "What kind of role are you targeting now?",
      "How did you prepare for this interview?",
      "What is your strongest engineering area?",
      "What is one area you are actively improving?"
    ]
  },
  {
    title: "Oracle payroll and HCM systems",
    signal: "Backend ownership under enterprise constraints",
    questions: [
      "Describe the payroll event engine architecture.",
      "How did the thread-pool redesign improve throughput?",
      "What does 10K+ events/hour mean in practical terms?",
      "How did you handle retries, duplicate events, and idempotency?",
      "What were the main failure modes in payroll processing?"
    ]
  },
  {
    title: "API design and integration",
    signal: "Contract thinking",
    questions: [
      "Design one payroll REST API you worked on.",
      "How do you choose pagination strategy?",
      "How do you version an API without breaking consumers?",
      "What should an error response contain?",
      "When would you move a workflow from sync API to async processing?"
    ]
  },
  {
    title: "Database performance",
    signal: "Evidence-driven tuning",
    questions: [
      "Explain a slow SQL query you improved.",
      "How do EXPLAIN PLAN and AWR help you debug?",
      "What makes an index useful or harmful?",
      "What is the difference between query rewrite and schema/index change?",
      "How would you prove a 4x improvement is real?"
    ]
  },
  {
    title: "UI modernization",
    signal: "Full-stack collaboration without overclaiming",
    questions: [
      "What was hard about moving legacy ADF flows toward newer UI patterns?",
      "Why make services stateless?",
      "How did lazy loading improve user experience?",
      "How did you test UI validation paths?",
      "How do you keep backend complexity from leaking into the screen?"
    ]
  },
  {
    title: "Samsung Android charging",
    signal: "Low-level debugging clarity",
    questions: [
      "Explain the Time-To-Full algorithm.",
      "What data does a charging system use?",
      "How did you debug charging IC issues?",
      "What did the log automation do?",
      "How do you communicate low-level technical work to non-kernel engineers?"
    ]
  },
  {
    title: "Independent projects",
    signal: "Architecture, product judgment, and honest scope",
    questions: [
      "Walk me through Market Narrative end to end.",
      "Why use Redis in the market data workflow?",
      "How does the system keep generated narratives source-led?",
      "What is The Win List and what problem does it solve?",
      "What would you improve next in either project?"
    ]
  },
  {
    title: "Behavioral drill",
    signal: "Ownership and learning loops",
    questions: [
      "Tell me about a time you disagreed with a design direction.",
      "Tell me about a production issue or high-risk release.",
      "Tell me about a time you had to learn a system quickly.",
      "Tell me about a mistake and what changed afterward.",
      "How do you mentor or influence without authority?"
    ]
  }
];

const answerFrames: AnswerFrame[] = [
  {
    title: "Six-sentence technical answer",
    useFor: "Most resume drill questions",
    steps: [
      "Context: what system and business flow?",
      "Problem: what was slow, risky, or unclear?",
      "Action: what did you personally change?",
      "Trade-off: what alternative did you reject?",
      "Evidence: metric, test, rollout, or observed result.",
      "Lesson: what would you repeat or change now?"
    ]
  },
  {
    title: "Metric defense",
    useFor: "25%, 4x, and 10K+ follow-ups",
    steps: [
      "Define the baseline and measurement window.",
      "Name the main bottleneck before the change.",
      "Explain the exact change, not just the tool.",
      "State how you checked for side effects.",
      "Say what the metric does not claim."
    ]
  },
  {
    title: "Architecture walkthrough",
    useFor: "Market Narrative, payroll, diagnostics",
    steps: [
      "Actors and inputs.",
      "Request or event flow.",
      "Storage ownership.",
      "Bottlenecks and scaling path.",
      "Failure handling and observability.",
      "One future improvement."
    ]
  },
  {
    title: "Honest scope boundary",
    useFor: "Tools and projects where depth varies",
    steps: [
      "State what you built or owned.",
      "State what was framework/platform-provided.",
      "Explain the decision you made.",
      "Offer the adjacent area you can learn or inspect."
    ]
  }
];

const weakSpotRepairs = [
  "Do not present limited-exposure tools as core strengths. Say: I used it in the project, but my deeper strengths are Java, Spring, SQL, Oracle systems, and React.",
  "Do not rely on GitHub activity as proof for The Win List. Talk about the live product behavior, privacy boundary, and local-first design.",
  "Do not quote metrics without a baseline. Always include how the number was measured.",
  "Do not let SQL answers become buzzwords. Anchor on execution plan, cardinality, index choice, and measured runtime.",
  "Do not overexplain Android kernel work. Start with product behavior, then go technical only when asked."
];

export function ResumeDrillPlan() {
  return (
    <section className="grid gap-5">
      <div className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-violet">Resume Drill</p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-ink">14-day plan to defend every resume line</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              Built for resume drill rounds where interviewers pick a bullet and keep asking why, how, proof, scale,
              trade-offs, and what you personally owned.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-2 rounded-[8px] border border-line bg-panel p-4">
            <div className="flex items-center gap-2 text-sm font-black text-violet">
              <TimerReset size={17} aria-hidden="true" />
              Daily time box
            </div>
            <p className="text-2xl font-black text-ink">160m</p>
            <p className="text-xs font-bold leading-5 text-slate-500">Enough depth for rehearsal without turning into panic studying.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {dailyRhythm.map((item) => (
            <article className="rounded-[8px] border border-line bg-white p-3" key={item.label}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-black text-ink">{item.label}</h2>
                <span className="rounded-full bg-violet/10 px-2 py-1 text-xs font-black text-violet">{item.minutes}</span>
              </div>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mic2 className="text-violet" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">How to introduce your preparation</h2>
          </div>
          <span className="rounded-full bg-violet/10 px-3 py-1 text-xs font-black text-violet">
            Prep story becomes question fuel
          </span>
        </div>
        <p className="max-w-4xl text-sm font-bold leading-6 text-slate-600">
          Use these as templates, not memorized speeches. If you are still preparing, speak in present tense:
          "I am structuring my preparation..." If the interview is after the sprint, say "I structured my preparation..."
          Every sentence should invite a follow-up you are ready to answer.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {preparationIntros.map((intro) => (
            <article className="rounded-[8px] border border-line bg-panel p-4" key={intro.title}>
              <h3 className="text-base font-black text-ink">{intro.title}</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{intro.script}</p>
              <div className="mt-4 rounded-[8px] border border-line bg-white p-3">
                <p className="text-xs font-black uppercase tracking-normal text-slate-500">Likely questions from this intro</p>
                <ul className="mt-2 grid gap-2 text-sm leading-6 text-slate-600">
                  {intro.likelyFollowUps.map((question) => (
                    <li className="flex gap-2" key={question}>
                      <Sparkles className="mt-1 shrink-0 text-gold" size={14} aria-hidden="true" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
        <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="text-cobalt" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">14-day sprint calendar</h2>
          </div>
          <div className="grid gap-3">
            {drillDays.map((day) => (
              <article className="rounded-[8px] border border-line bg-panel p-4" key={day.day}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-cobalt">{day.day}</p>
                    <h3 className="mt-1 text-lg font-black text-ink">{day.title}</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">Proof: {day.proof}</span>
                </div>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{day.objective}</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {day.drills.map((drill) => (
                    <li className="flex gap-2" key={drill}>
                      <CheckCircle2 className="mt-1 shrink-0 text-moss" size={15} aria-hidden="true" />
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <aside className="grid gap-5">
          <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
            <div className="mb-4 flex items-center gap-2">
              <Target className="text-coral" size={20} aria-hidden="true" />
              <h2 className="text-xl font-black text-ink">Answer frameworks</h2>
            </div>
            <div className="grid gap-3">
              {answerFrames.map((frame) => (
                <article className="rounded-[8px] border border-line bg-panel p-4" key={frame.title}>
                  <h3 className="text-base font-black text-ink">{frame.title}</h3>
                  <p className="mt-1 text-xs font-black uppercase tracking-normal text-slate-500">{frame.useFor}</p>
                  <ol className="mt-3 grid gap-1 text-sm leading-6 text-slate-600">
                    {frame.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="text-moss" size={20} aria-hidden="true" />
              <h2 className="text-xl font-black text-ink">Guardrails</h2>
            </div>
            <ul className="grid gap-2 text-sm leading-6 text-slate-600">
              {weakSpotRepairs.map((repair) => (
                <li className="rounded-[8px] border border-line bg-panel p-3" key={repair}>
                  {repair}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-gold" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">Resume drill question bank</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-black text-gold">
            <Mic2 size={15} aria-hidden="true" />
            Answer aloud, then compress
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {drillGroups.map((group) => (
            <article className="rounded-[8px] border border-line bg-panel p-4" key={group.title}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-base font-black text-ink">{group.title}</h3>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">{group.signal}</span>
              </div>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                {group.questions.map((question) => (
                  <li className="flex gap-2" key={question}>
                    <Sparkles className="mt-1 shrink-0 text-gold" size={14} aria-hidden="true" />
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] border border-line bg-ink p-5 text-white shadow-focus">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-gold">Final readiness test</p>
            <h2 className="mt-1 text-2xl font-black">You are ready when your answers survive interruption.</h2>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-300">
              Ask a friend to interrupt every answer at sentence two with "why?", "how did you measure that?",
              "what broke?", or "what would you change?" If the answer stays structured, the resume is interview-safe.
            </p>
          </div>
          <div className="rounded-[8px] border border-white/15 bg-white/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-gold">
              <BadgeCheck size={17} aria-hidden="true" />
              Pass condition
            </div>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-200">
              30 random resume questions, 24 green answers, zero unsupported claims.
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
