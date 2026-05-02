"use client";

import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTechPrepStore } from "../lib/store";

export function AdminGate() {
  const authenticate = useTechPrepStore((state) => state.authenticate);
  const [email, setEmail] = useState("abhey@techprep.local");
  const [passcode, setPasscode] = useState("zen180");
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen px-4 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[8px] border border-line bg-paper p-6 shadow-calm sm:p-8">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-ink text-white">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight text-ink sm:text-5xl">
            TechPrep Zen
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Your private 180-minute technical interview workspace. The dashboard opens directly into
            today's DSA, retrieval, and system design plan.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["150", "DSA prompts"],
              ["50", "design modules"],
              ["180", "minutes/day"]
            ].map(([value, label]) => (
              <div className="rounded-[8px] border border-line bg-panel p-4" key={label}>
                <div className="text-2xl font-black text-ink">{value}</div>
                <div className="mt-1 text-sm font-bold text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          className="rounded-[8px] border border-line bg-paper p-6 shadow-focus"
          onSubmit={(event) => {
            event.preventDefault();
            const ok = authenticate(email, passcode);
            setError(ok ? "" : "Use the seeded local admin credentials.");
          }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-cobalt/10 text-cobalt">
              <LockKeyhole size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-black text-ink">Admin Gate</h2>
              <p className="text-sm text-slate-500">Local-first profile for the v1 build.</p>
            </div>
          </div>

          <label className="block text-sm font-extrabold text-slate-700">
            Email
            <input
              className="mt-2 h-12 w-full rounded-[8px] border border-line bg-panel px-3 text-ink outline-none ring-cobalt/20 transition focus:ring-4"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-extrabold text-slate-700">
            Passcode
            <input
              className="mt-2 h-12 w-full rounded-[8px] border border-line bg-panel px-3 text-ink outline-none ring-cobalt/20 transition focus:ring-4"
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
            />
          </label>
          {error ? <p className="mt-3 text-sm font-bold text-coral">{error}</p> : null}
          <button className="mt-6 h-12 w-full rounded-[8px] bg-ink px-4 font-black text-white shadow-calm transition hover:-translate-y-0.5">
            Enter Focus Workspace
          </button>
        </form>
      </section>
    </main>
  );
}
