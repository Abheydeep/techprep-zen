"use client";

import { ExternalLink, Github, PlaySquare, ScrollText } from "lucide-react";

const resources = [
  {
    title: "NeetCode 150 course directory",
    kind: "Video",
    href: "https://www.classcentral.com/course/freecodecamp-neetcode-150-course-all-coding-interview-questions-solved-423701",
    icon: PlaySquare,
    note: "Use as the public video index for walkthroughs."
  },
  {
    title: "NeetCode roadmap",
    kind: "Practice",
    href: "https://neetcode.io/roadmap",
    icon: ScrollText,
    note: "Canonical pattern grouping and problem ordering."
  },
  {
    title: "System Design Primer",
    kind: "GitHub",
    href: "https://github.com/donnemartin/system-design-primer",
    icon: Github,
    note: "Foundational distributed-systems reading and architecture examples."
  },
  {
    title: "System Design 101",
    kind: "GitHub",
    href: "https://github.com/ByteByteGoHq/system-design-101",
    icon: Github,
    note: "Compact diagrams and modern trade-off summaries."
  }
];

export function Resources() {
  return (
    <section className="rounded-[8px] border border-line bg-paper p-5 shadow-calm">
      <p className="text-sm font-black uppercase tracking-normal text-gold">Closed ecosystem</p>
      <h1 className="mt-1 text-2xl font-black text-ink">Curated learning resources</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        The workspace keeps the learning loop internal, but public source links remain available for
        attribution and deeper review.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <a
              className="group rounded-[8px] border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-gold"
              href={resource.href}
              key={resource.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-gold/10 text-gold">
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-ink">{resource.title}</h2>
                    <p className="text-xs font-black uppercase tracking-normal text-slate-500">{resource.kind}</p>
                  </div>
                </div>
                <ExternalLink className="text-slate-400 transition group-hover:text-gold" size={18} aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{resource.note}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
