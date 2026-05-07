"use client";

import { useMemo, useState } from "react";
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

type StudyTrack = {
  title: string;
  focus: string;
  study: string[];
  build: string[];
  answerAngles: string[];
};

type AnswerSeed = {
  question: string;
  tested: string;
  answer: string;
  prepare: string[];
  followUps: string[];
  avoid: string[];
};

type ResumeSection = "study" | "answers" | "sprint" | "questions" | "guardrails";

const dailyRhythm = [
  { label: "Recall", minutes: "25m", detail: "Answer from memory before reading notes." },
  { label: "Drill", minutes: "55m", detail: "Practice 6-8 questions out loud with a timer." },
  { label: "Whiteboard", minutes: "45m", detail: "Draw flows, data paths, bottlenecks, and failure cases." },
  { label: "Record", minutes: "20m", detail: "Record one answer, score clarity, cut rambling." },
  { label: "Repair", minutes: "15m", detail: "Patch weak facts, metrics, and trade-off language." }
];

const studyTracks: StudyTrack[] = [
  {
    title: "Opening and career narrative",
    focus: "Make the first five minutes controlled, technical, and tied to the resume.",
    study: [
      "Resume proof map: context, ownership, metric, trade-off, evidence, and what you would improve.",
      "Career transitions: Samsung low-level debugging to Oracle enterprise backend and database-heavy systems.",
      "Role signals from the job description: backend ownership, reliability, data performance, API design, and communication."
    ],
    build: [
      "45-second and 90-second resume walkthroughs.",
      "A crisp Samsung-to-Oracle transition story.",
      "A red/yellow/green list of resume bullets by confidence."
    ],
    answerAngles: [
      "Walk me through your resume.",
      "Why did you move from Samsung to Oracle?",
      "What kind of role are you targeting?"
    ]
  },
  {
    title: "Java and Spring backend",
    focus: "Defend your core backend strength without drifting into tool buzzwords.",
    study: [
      "Java collections, immutability, exception handling, streams at a practical level, and common object-oriented design choices.",
      "ExecutorService, thread pools, queue depth, batch size, blocking vs non-blocking work, and basic concurrency failure modes.",
      "Spring controllers, services, dependency injection, validation, error handling, logging, transaction boundaries, and REST contracts."
    ],
    build: [
      "One payroll event flow diagram from intake to processing result.",
      "One REST API contract with request, response, errors, pagination, and idempotency behavior.",
      "One throughput story showing baseline, bottleneck, change, metric, and remaining risk."
    ],
    answerAngles: [
      "How did the thread-pool redesign improve throughput?",
      "How would you design a payroll events API?",
      "How do you handle retries and duplicate requests?"
    ]
  },
  {
    title: "Event processing and reliability",
    focus: "Show that you think about failure, not only happy-path coding.",
    study: [
      "Synchronous vs asynchronous workflows, batching, backpressure, retry policies, deduplication, and idempotency keys.",
      "Dead-letter handling, audit logs, monitoring signals, alert thresholds, and replay safety.",
      "Throughput, latency, queue wait time, downstream capacity, and how one bottleneck moves after optimization."
    ],
    build: [
      "A failure-mode table: duplicate event, timeout, bad payload, downstream outage, partial success.",
      "A retry policy with max attempts, delay, idempotency, and audit trail.",
      "A 10x-volume scaling plan with the first bottleneck you would inspect."
    ],
    answerAngles: [
      "What does 10K+ events/hour mean in practical terms?",
      "What breaks first if volume grows 10x?",
      "How do you make event processing safe to retry?"
    ]
  },
  {
    title: "SQL, PL/SQL, and Oracle performance",
    focus: "Make every performance claim measurable and technically grounded.",
    study: [
      "Indexes, selectivity, cardinality, joins, bind variables, partitions, locks, transactions, and read/write trade-offs.",
      "EXPLAIN PLAN, AWR reports, wait events, full scans, nested loops, hash joins, and plan changes.",
      "PL/SQL bulk operations, procedural vs set-based logic, commit frequency, and rollback safety."
    ],
    build: [
      "One slow-query story with symptom, evidence, change, measurement, and rollback plan.",
      "A before/after checklist for proving a 4x improvement.",
      "A short answer for when an index hurts more than it helps."
    ],
    answerAngles: [
      "Explain a query you optimized.",
      "How do EXPLAIN PLAN and AWR help you debug?",
      "How would you prove the 4x improvement is real?"
    ]
  },
  {
    title: "Oracle HCM modernization",
    focus: "Explain modernization as risk reduction, not just UI change.",
    study: [
      "Legacy ADF-style flows, managed-bean responsibilities, stateless service design, and separating UI behavior from business logic.",
      "Asynchronous validation, lazy loading, API-backed screens, regression testing, rollout safety, and backward compatibility.",
      "How enterprise workflows protect correctness when multiple teams or modules depend on the same data."
    ],
    build: [
      "A before/after flow showing what moved out of the UI layer.",
      "A validation example with slow dependency, async response, and user-facing error state.",
      "A regression checklist for high-risk HCM screens."
    ],
    answerAngles: [
      "Why make services stateless?",
      "What was hard about modernizing legacy flows?",
      "How did you avoid breaking existing workflows?"
    ]
  },
  {
    title: "Samsung Android charging work",
    focus: "Turn low-level debugging into a clear product and engineering story.",
    study: [
      "Battery charging basics, Time-To-Full inputs, current, voltage, temperature, charging limits, and product display behavior.",
      "Kernel logs, device signals, charging IC behavior at a high level, and how to form debugging hypotheses from logs.",
      "How to explain low-level work to a non-kernel interviewer without pretending hardware ownership."
    ],
    build: [
      "A plain-English Time-To-Full answer and a technical Time-To-Full answer.",
      "A diagnostic workflow: symptom, log signal, hypothesis, verification, fix or escalation.",
      "A boundary statement for what you owned vs what hardware or platform teams owned."
    ],
    answerAngles: [
      "Explain the Time-To-Full algorithm.",
      "How did you debug charging issues?",
      "How did the log automation help?"
    ]
  },
  {
    title: "Independent project architecture",
    focus: "Use projects as proof of product thinking and system-design range, not GitHub activity.",
    study: [
      "Local-first data, optional sync, privacy boundaries, authentication, cache strategy, background jobs, and admin review flows.",
      "PostgreSQL partitions, Redis caching, source traceability, rate limits, data freshness, and failure recovery for market workflows.",
      "Diagnostics pipelines: log parsing, latency summaries, anomaly detection, signal vs noise, and report usefulness."
    ],
    build: [
      "One architecture diagram each for Market Narrative, The Win List, and diagnostics analyzer.",
      "A data model sketch for each project: entities, reads, writes, and risky queries.",
      "A product trade-off list: privacy vs sync, speed vs accuracy, automation vs review."
    ],
    answerAngles: [
      "Walk me through Market Narrative end to end.",
      "What is The Win List and why local-first?",
      "What would you improve next?"
    ]
  },
  {
    title: "Behavioral and seniority signals",
    focus: "Prepare stories that show judgment, communication, and learning loops.",
    study: [
      "STAR, CARL, and trade-off answer patterns for conflict, ambiguity, missed estimates, and production risk.",
      "How to explain disagreement without blaming, and how to show learning without sounding defensive.",
      "Mentoring, reviews, cross-team communication, release safety, and prioritization under uncertainty."
    ],
    build: [
      "Ten story cards: conflict, mistake, ambiguity, production issue, learning fast, mentoring, trade-off, deadline, quality, ownership.",
      "A one-line lesson for each story.",
      "One example where you changed your mind after new evidence."
    ],
    answerAngles: [
      "Tell me about a time you disagreed with a design.",
      "Tell me about a mistake.",
      "How do you influence without authority?"
    ]
  }
];

const answerSeeds: AnswerSeed[] = [
  {
    question: "Resume walkthrough: backend systems narrative",
    tested: "Can you make your resume sound like one coherent engineering story instead of a list of tools?",
    answer:
      "Lead with your engineering pattern: debugging real systems, then building enterprise backend flows, then using projects to show architecture judgment. Samsung should sound like the place where you learned log-driven debugging, device behavior, and careful signal interpretation. Oracle should become the center of the story: Java/Spring services, payroll/HCM workflows, event processing, SQL/PLSQL performance, and modernization work under enterprise constraints. Projects should support the story only after work experience: they show product and architecture thinking, not the main proof of seniority.",
    prepare: [
      "A 60-second version with no project details unless asked.",
      "A 2-minute version with one Samsung example, two Oracle examples, and one project example.",
      "One exact metric you can defend first: 25%, 4x, or 10K+ events/hour."
    ],
    followUps: [
      "Why did you move from Samsung to Oracle?",
      "Which Oracle system had the most ownership?",
      "Which resume bullet should we deep dive first?"
    ],
    avoid: [
      "Do not start with independent projects before work experience.",
      "Do not sound like a general full-stack profile; keep the center of gravity on backend and data systems."
    ]
  },
  {
    question: "Payroll event engine architecture",
    tested: "Can you explain a production-like backend system with ownership, failure handling, and measurable throughput?",
    answer:
      "Answer it as a flow, not as a component list. Start from event creation: what business action creates the payroll event, what identifiers travel with it, how validation happens, where it is persisted or staged, how workers pick it up, and what downstream payroll/HCM state changes. Then explain reliability: status transitions, audit trail, retry rules, duplicate detection, and what happens when a downstream dependency fails. Only after that discuss throughput: what limited the old path, what changed in worker execution or batching, and how the 10K+ events/hour claim was measured.",
    prepare: [
      "Draw the event lifecycle: received, validated, queued/staged, processing, completed, failed, retry/manual review.",
      "Define the event key or business identifier used to reason about duplicates.",
      "Write the measurement story: baseline window, load size, before/after throughput, and side effects checked."
    ],
    followUps: [
      "Where is the transaction boundary?",
      "How do you avoid double-processing payroll events?",
      "What breaks first if volume doubles or grows 10x?"
    ],
    avoid: [
      "Do not say only 'thread pool improved throughput.' That skips the system design.",
      "Do not claim exactly-once processing unless you can explain the storage and transaction guarantees."
    ]
  },
  {
    question: "Thread-pool and batching performance",
    tested: "Can you reason about concurrency tuning without giving the shallow 'more threads is faster' answer?",
    answer:
      "Start with workload classification. If event processing spends time waiting on database or downstream calls, the tuning logic is different from CPU-bound processing. Then explain the old bottleneck: worker starvation, queue buildup, oversized batches, undersized batches, lock contention, connection-pool pressure, or downstream throttling. A strong answer states what you changed, why that value was chosen, and what you watched afterward: queue wait time, throughput, error rate, DB load, thread utilization, and downstream latency. The senior-level piece is saying what limit you did not cross.",
    prepare: [
      "Thread-pool parameters: core/max size, queue type, rejection policy, timeout behavior if applicable.",
      "Batch-size trade-off: fewer DB calls vs memory, lock duration, latency, and retry blast radius.",
      "Before/after signals: queue depth, average processing time, p95/p99 latency, CPU, DB sessions, error rate."
    ],
    followUps: [
      "How did you choose thread count?",
      "What happens if every worker blocks on DB?",
      "How do you know the fix did not just move the bottleneck?"
    ],
    avoid: [
      "Do not claim linear scaling with thread count.",
      "Do not ignore database connection pool size when talking about worker count."
    ]
  },
  {
    question: "Idempotency, retries, and duplicate events",
    tested: "Can you protect correctness when systems retry, timeout, or receive duplicates?",
    answer:
      "Define the business identity first: the same payroll event should map to the same logical operation. Then walk through cases. On first processing, create or claim the processing record. On retry, check current status before doing work. On duplicate, return the existing result or skip safely. On timeout or partial success, the system needs a persisted status that prevents blind re-execution. Mention unique constraints, status transitions, audit records, and replay rules. Separate HTTP retry from business retry; the transport can repeat, but the business operation must remain controlled.",
    prepare: [
      "A status model: received, in_progress, completed, failed_retryable, failed_terminal, manual_review.",
      "The idempotency key: event id, employee/payroll cycle key, source transaction id, or another natural key.",
      "One example of a partial failure and how the next retry behaves."
    ],
    followUps: [
      "Where would you put the unique constraint?",
      "What if processing succeeds but response fails?",
      "How would you replay failed events safely?"
    ],
    avoid: [
      "Do not use 'idempotent' as a buzzword without naming the key.",
      "Do not say retries solve reliability if duplicates can change payroll state twice."
    ]
  },
  {
    question: "SQL and PL/SQL performance defense",
    tested: "Can you prove a database performance claim with execution evidence, not slogans?",
    answer:
      "A strong spoken answer should sound like this: the slow path was not just 'a query'; it was a specific payroll or HCM flow with a measurable pain point such as report timeout, batch delay, high DB time, or lock wait. I first separated application time from DB time using logs, elapsed time, AWR/session evidence, or repeated runs. Then I inspected the plan and the data pattern: which tables were driving the query, expected vs returned rows, join method, full scan vs index access, partition pruning, bind variables, and whether the optimizer had bad cardinality. The fix depends on the evidence: rewrite predicates or joins, add or change an index only if selectivity and write cost make sense, refresh stats if the optimizer is misled, use partition pruning if the access pattern supports it, or replace row-by-row PL/SQL with set-based or bulk operations. The result is not credible until I can show before/after runtime on comparable input, the changed plan or DB metric, and that the fix did not hurt writes or related queries.",
    prepare: [
      "One real query shape: main tables, joins, predicates, expected row counts, and why the old plan was expensive.",
      "Execution evidence: plan hash or plan change, estimated vs actual cardinality if known, buffer gets, elapsed time, wait event, or AWR section.",
      "The fix category: rewrite, index, stats refresh, bind variable issue, partition pruning, bulk PL/SQL, or removing row-by-row work.",
      "Validation: same input size, before/after runtime, side effects on writes, other queries, and rollback plan."
    ],
    followUps: [
      "Why did the optimizer choose the bad plan?",
      "Why was adding an index safe or unsafe?",
      "How did you distinguish DB time from application time?",
      "What would happen as data volume grows 10x?",
      "How did you prevent the improvement from regressing later?"
    ],
    avoid: [
      "Do not say 'I used EXPLAIN PLAN and optimized it' without naming what the plan showed.",
      "Do not claim an index fixed it unless you can explain selectivity and write overhead.",
      "Do not quote 4x unless you can define baseline, measurement window, and workload size."
    ]
  },
  {
    question: "HCM modernization: ADF to service-backed flows",
    tested: "Can you explain modernization as architecture and risk reduction, not UI cosmetics?",
    answer:
      "Pick one flow and explain before/after. Before: screen-managed state, tightly coupled validation, heavy page load, or business logic living too close to the UI. After: service-backed contract, clearer validation boundary, stateless behavior where possible, lazy loading for expensive data, and async validation when the screen should not block. The senior-level answer is about preserving behavior: how you avoided regressions, how contracts were tested, and how rollout risk was controlled in an enterprise HCM workflow.",
    prepare: [
      "One concrete legacy flow and what made it risky.",
      "Before/after ownership: UI state, service method, validation, persistence, and error display.",
      "Testing plan: unit, service contract, regression paths, and high-risk data cases."
    ],
    followUps: [
      "Why are stateless services easier to operate?",
      "What validation stayed client-side vs server-side?",
      "How did lazy loading change performance and failure modes?"
    ],
    avoid: [
      "Do not make it sound like a cosmetic UI migration.",
      "Do not overclaim ownership of every layer if you mainly owned backend/service pieces."
    ]
  },
  {
    question: "Samsung Time-To-Full and charging diagnostics",
    tested: "Can you turn low-level device work into a clear debugging and product-impact story?",
    answer:
      "Start with what the user sees: the phone estimates time until full charge. Then explain the signals at a safe level: battery level, charge current, voltage, thermal state, charger type, charging limits, and platform readings. Your strongest story is the diagnostic loop: observe incorrect or unstable estimate, inspect logs, correlate with charging state, isolate whether the issue is algorithm logic, platform signal, or hardware behavior, then fix or route correctly. Keep ownership boundaries clear.",
    prepare: [
      "A plain-English explanation of Time-To-Full.",
      "A technical explanation of the signals used by the estimate.",
      "One debugging story with symptom, logs, hypothesis, verification, and result."
    ],
    followUps: [
      "What causes Time-To-Full to fluctuate?",
      "How did your log automation reduce manual debugging time?",
      "How did you know it was not a hardware issue?"
    ],
    avoid: [
      "Do not pretend to own hardware design.",
      "Do not drown the answer in kernel terms before the interviewer asks."
    ]
  },
  {
    question: "Market Narrative architecture",
    tested: "Can you defend a project as a real system with data flow, quality control, and scaling trade-offs?",
    answer:
      "Describe the pipeline from raw source to published narrative. Sources are ingested, normalized, grouped into signals, enriched with technical indicators or clustering, checked through review or quality gates, stored with traceability, cached for read paths, and exposed publicly. Then defend the hard parts: source credibility, stale data, failed ingestion, duplicate stories, cache invalidation, and cost. Make clear that narratives are source-led and reviewable, not unsupported AI claims.",
    prepare: [
      "Architecture diagram: ingestion, processing, storage, cache, review, public read path.",
      "Data model: source, asset/topic, signal, generated narrative, review status, published artifact.",
      "Scaling path: first bottleneck, cache strategy, partitioning reason, and background job behavior."
    ],
    followUps: [
      "Why PostgreSQL partitions?",
      "Why Redis and what keys would be cached?",
      "How do you prevent stale or unsupported narratives?"
    ],
    avoid: [
      "Do not describe it as magic market prediction.",
      "Do not claim production-grade scale unless you can show traffic, ops, and monitoring proof."
    ]
  },
  {
    question: "The Win List local-first product boundary",
    tested: "Can you talk about a project honestly when GitHub history is not strong evidence?",
    answer:
      "Do not sell this as a major engineering achievement. Sell it as product judgment. The app helps users track daily wins and notes, and local-first makes sense because the data is personal and should work without a cloud dependency. Optional sync is a trade-off: convenience and backup vs privacy, conflict handling, and auth complexity. The defensible answer is about data boundary, offline behavior, and what you would improve next.",
    prepare: [
      "Local data model: win, date, note, tag/status if applicable.",
      "Privacy boundary: what stays local, what sync would change, and what consent means.",
      "Future improvement: export/import, backup, reminders, or conflict-safe sync."
    ],
    followUps: [
      "Why local-first instead of cloud-first?",
      "How would sync conflicts be resolved?",
      "What would you remove or simplify?"
    ],
    avoid: [
      "Do not use commit history as evidence.",
      "Do not overstate it as a complex backend system."
    ]
  },
  {
    question: "Java diagnostics analyzer",
    tested: "Can you connect a project to real performance and observability instincts?",
    answer:
      "Explain the input-to-action loop. Inputs could be logs, SQL latency lines, thread usage, memory patterns, or operational traces. The analyzer should parse and group signals, calculate severity, identify repeated slow paths, and produce a report a developer can act on. The senior-level discussion is noise control: thresholds, false positives, correlation across signals, and what should be alerted vs simply reported.",
    prepare: [
      "One sample input and the output report it produces.",
      "Threshold logic: slow SQL, repeated error, memory warning, thread saturation, or anomaly condition.",
      "How a developer uses the report to decide the next debugging step."
    ],
    followUps: [
      "How do you avoid noisy alerts?",
      "How would scheduled anomaly detection work?",
      "What would you add to make it production-ready?"
    ],
    avoid: [
      "Do not make it sound like full observability infrastructure.",
      "Do not claim AWR-level depth unless you can show the specific fields and analysis."
    ]
  },
  {
    question: "Behavioral: design disagreement or production risk",
    tested: "Can you show judgment without blaming people or sounding passive?",
    answer:
      "Use one real story with stakes. Name the system, the risk, what you believed, what the other option was, and what evidence you used. Show how you communicated: design review, test data, production risk, rollback concern, or performance measurement. End with the decision, compromise, and what changed afterward. This is not a morality story; it is proof that you can reason under constraints.",
    prepare: [
      "One disagreement story with technical evidence.",
      "One production-risk story with mitigation and rollback thinking.",
      "One learning story where new evidence changed your mind."
    ],
    followUps: [
      "What would you do differently now?",
      "How did you bring others along?",
      "What was the measurable outcome?"
    ],
    avoid: [
      "Do not blame another team.",
      "Do not use a story where your action had no visible consequence."
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
      "Practice transitions from Samsung to Oracle and from backend work to product projects.",
      "Prepare a concise answer for your strongest technical area and the resume bullet you want to lead with.",
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
      "Which resume bullet should we deep dive first?",
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

const resumeSections: { id: ResumeSection; label: string; detail: string }[] = [
  { id: "study", label: "Study", detail: "What to learn" },
  { id: "answers", label: "Answers", detail: "How to respond" },
  { id: "sprint", label: "14 Days", detail: "Daily plan" },
  { id: "questions", label: "Questions", detail: "Drill bank" },
  { id: "guardrails", label: "Guardrails", detail: "Stay honest" }
];

export function ResumeDrillPlan() {
  const [activeSection, setActiveSection] = useState<ResumeSection>("study");
  const [activeTrackTitle, setActiveTrackTitle] = useState(studyTracks[0].title);
  const [activeAnswerQuestion, setActiveAnswerQuestion] = useState(answerSeeds[0].question);
  const [activeDayLabel, setActiveDayLabel] = useState(drillDays[0].day);
  const [activeGroupTitle, setActiveGroupTitle] = useState(drillGroups[0].title);

  const activeTrack = useMemo(
    () => studyTracks.find((track) => track.title === activeTrackTitle) ?? studyTracks[0],
    [activeTrackTitle]
  );
  const activeAnswer = useMemo(
    () => answerSeeds.find((seed) => seed.question === activeAnswerQuestion) ?? answerSeeds[0],
    [activeAnswerQuestion]
  );
  const activeDay = useMemo(
    () => drillDays.find((day) => day.day === activeDayLabel) ?? drillDays[0],
    [activeDayLabel]
  );
  const activeQuestionGroup = useMemo(
    () => drillGroups.find((group) => group.title === activeGroupTitle) ?? drillGroups[0],
    [activeGroupTitle]
  );
  const activeSectionIndex = resumeSections.findIndex((section) => section.id === activeSection) + 1;

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

      <section className="sticky top-3 z-20 rounded-[8px] border border-line bg-paper/95 p-3 shadow-calm backdrop-blur">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="Resume drill sections">
          {resumeSections.map((section) => {
            const selected = activeSection === section.id;
            return (
              <button
                className={`rounded-[8px] border px-3 py-3 text-left transition ${
                  selected
                    ? "border-ink bg-ink text-white shadow-focus"
                    : "border-line bg-white text-ink hover:border-cobalt"
                }`}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                type="button"
                aria-pressed={selected}
              >
                <span className="block text-sm font-black">{section.label}</span>
                <span className={`mt-1 block text-xs font-bold ${selected ? "text-slate-200" : "text-slate-500"}`}>
                  {section.detail}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rounded-[8px] border border-line bg-ink p-4 text-white shadow-focus">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-gold">
              Browse mode {activeSectionIndex}/{resumeSections.length}
            </p>
            <h2 className="mt-1 text-xl font-black">
              {resumeSections.find((section) => section.id === activeSection)?.label}
            </h2>
          </div>
          <p className="max-w-2xl text-sm font-bold leading-6 text-slate-300">
            Pick one lane, study the material, then drill the answers. The full roadmap is still here, but it no
            longer dumps every card at once.
          </p>
        </div>
      </div>

      {activeSection === "study" ? (
      <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-cobalt" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">Study roadmap: material to learn</h2>
          </div>
          <span className="rounded-full bg-cobalt/10 px-3 py-1 text-xs font-black text-cobalt">
            Study first, then drill
          </span>
        </div>
        <p className="max-w-4xl text-sm font-bold leading-6 text-slate-600">
          Use this as the syllabus behind the resume drill. For each track, revise the concepts, produce one
          concrete artifact, then practice the answer angles until they sound natural.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
          <nav className="grid content-start gap-2" aria-label="Study roadmap tracks">
            {studyTracks.map((track) => {
              const selected = activeTrack.title === track.title;
              return (
                <button
                  className={`rounded-[8px] border p-3 text-left transition ${
                    selected ? "border-cobalt bg-cobalt/10 text-ink" : "border-line bg-panel text-ink hover:border-cobalt"
                  }`}
                  key={track.title}
                  onClick={() => setActiveTrackTitle(track.title)}
                  type="button"
                  aria-pressed={selected}
                >
                  <span className="block text-sm font-black">{track.title}</span>
                  <span className="mt-1 line-clamp-2 block text-xs font-bold leading-5 text-slate-500">{track.focus}</span>
                </button>
              );
            })}
          </nav>

          <article className="rounded-[8px] border border-line bg-panel p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-ink">{activeTrack.title}</h3>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{activeTrack.focus}</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                Material + artifact + answers
              </span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-cobalt">Study material</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeTrack.study.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <CheckCircle2 className="mt-1 shrink-0 text-cobalt" size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-moss">Build before interview</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeTrack.build.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <CheckCircle2 className="mt-1 shrink-0 text-moss" size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-coral">Answer angles</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeTrack.answerAngles.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <Sparkles className="mt-1 shrink-0 text-coral" size={14} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      ) : null}

      {activeSection === "answers" ? (
      <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="text-coral" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">Resume defense answer guide</h2>
          </div>
          <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-black text-coral">
            Answer direction, not memorization
          </span>
        </div>
        <p className="max-w-4xl text-sm font-bold leading-6 text-slate-600">
          These are deeper answer maps for resume drill rounds. Fill in your exact system details, but use this level
          of depth so the answer survives follow-ups.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[340px_1fr]">
          <nav className="grid content-start gap-2" aria-label="Core answer questions">
            {answerSeeds.map((seed) => {
              const selected = activeAnswer.question === seed.question;
              return (
                <button
                  className={`rounded-[8px] border p-3 text-left text-sm font-black transition ${
                    selected ? "border-coral bg-coral/10 text-ink" : "border-line bg-panel text-ink hover:border-coral"
                  }`}
                  key={seed.question}
                  onClick={() => setActiveAnswerQuestion(seed.question)}
                  type="button"
                  aria-pressed={selected}
                >
                  {seed.question}
                </button>
              );
            })}
          </nav>
          <article className="rounded-[8px] border border-line bg-panel p-5">
            <p className="text-xs font-black uppercase tracking-normal text-coral">Selected defense path</p>
            <h3 className="mt-2 text-2xl font-black text-ink">{activeAnswer.question}</h3>
            <div className="mt-4 rounded-[8px] border border-coral/20 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-normal text-coral">What the interviewer is testing</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{activeAnswer.tested}</p>
            </div>
            <p className="mt-4 text-sm font-bold leading-7 text-slate-600">{activeAnswer.answer}</p>
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-cobalt">Exact details to prepare</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeAnswer.prepare.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <CheckCircle2 className="mt-1 shrink-0 text-cobalt" size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-gold">Likely deeper follow-ups</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeAnswer.followUps.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <Sparkles className="mt-1 shrink-0 text-gold" size={14} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[8px] border border-line bg-white p-4">
                <p className="text-xs font-black uppercase tracking-normal text-coral">Do not claim</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
                  {activeAnswer.avoid.map((item) => (
                    <li className="flex gap-2" key={item}>
                      <ShieldCheck className="mt-1 shrink-0 text-coral" size={15} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      ) : null}

      {activeSection === "sprint" ? (
      <div className="grid gap-5">
        <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="text-cobalt" size={20} aria-hidden="true" />
            <h2 className="text-xl font-black text-ink">14-day sprint calendar</h2>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
              {drillDays.map((day) => {
                const selected = activeDay.day === day.day;
                return (
                  <button
                    className={`rounded-[8px] border px-3 py-2 text-left transition ${
                      selected ? "border-cobalt bg-cobalt/10 text-ink" : "border-line bg-panel text-ink hover:border-cobalt"
                    }`}
                    key={day.day}
                    onClick={() => setActiveDayLabel(day.day)}
                    type="button"
                    aria-pressed={selected}
                  >
                    <span className="block text-xs font-black uppercase tracking-normal text-cobalt">{day.day}</span>
                    <span className="mt-1 block text-sm font-black">{day.title}</span>
                  </button>
                );
              })}
            </div>
            <article className="rounded-[8px] border border-line bg-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-normal text-cobalt">{activeDay.day}</p>
                  <h3 className="mt-1 text-2xl font-black text-ink">{activeDay.title}</h3>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">Proof: {activeDay.proof}</span>
              </div>
              <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{activeDay.objective}</p>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
                {activeDay.drills.map((drill) => (
                  <li className="flex gap-2" key={drill}>
                    <CheckCircle2 className="mt-1 shrink-0 text-moss" size={15} aria-hidden="true" />
                    <span>{drill}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <aside className="hidden">
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

      ) : null}

      {activeSection === "questions" ? (
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
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <nav className="grid content-start gap-2" aria-label="Question groups">
            {drillGroups.map((group) => {
              const selected = activeQuestionGroup.title === group.title;
              return (
                <button
                  className={`rounded-[8px] border p-3 text-left transition ${
                    selected ? "border-gold bg-gold/10 text-ink" : "border-line bg-panel text-ink hover:border-gold"
                  }`}
                  key={group.title}
                  onClick={() => setActiveGroupTitle(group.title)}
                  type="button"
                  aria-pressed={selected}
                >
                  <span className="block text-sm font-black">{group.title}</span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">{group.signal}</span>
                </button>
              );
            })}
          </nav>
          <article className="rounded-[8px] border border-line bg-panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-2xl font-black text-ink">{activeQuestionGroup.title}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                {activeQuestionGroup.signal}
              </span>
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              {activeQuestionGroup.questions.map((question) => (
                <li className="flex gap-2 rounded-[8px] border border-line bg-white p-3" key={question}>
                  <Sparkles className="mt-1 shrink-0 text-gold" size={14} aria-hidden="true" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      ) : null}

      {activeSection === "guardrails" ? (
      <>
      <div className="grid gap-5 xl:grid-cols-2">
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
      </div>

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
      </>
      ) : null}
    </section>
  );
}
