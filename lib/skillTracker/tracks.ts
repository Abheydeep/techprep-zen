import type { Phase, TrackMeta, TrackId } from "./types";

export const TRACKS: Record<TrackId, TrackMeta> = {
  english: {
    id: "english",
    label: "English / IELTS",
    shortLabel: "English",
    tone: "text-cobalt bg-cobalt/10 border-cobalt/30",
    hex: "#245fbc",
    description: "CLB 9+ language polish for Express Entry and senior-engineer communication."
  },
  coding: {
    id: "coding",
    label: "Coding fundamentals",
    shortLabel: "Coding",
    tone: "text-gold bg-gold/10 border-gold/30",
    hex: "#b88714",
    description: "Clean code, design patterns, testing, and architecture vocabulary."
  },
  website: {
    id: "website",
    label: "Website reconstruction",
    shortLabel: "Website",
    tone: "text-violet bg-violet/10 border-violet/30",
    hex: "#7057a3",
    description: "Refactor Portfolio, Market Narrative, The Win List, marketNews into evidence."
  },
  express: {
    id: "express",
    label: "Express Entry",
    shortLabel: "PR",
    tone: "text-coral bg-coral/10 border-coral/30",
    hex: "#d85a3a",
    description: "Documents, IELTS, ECA, NOC, profile, PNP, draws."
  },
  interview: {
    id: "interview",
    label: "Interview readiness",
    shortLabel: "Interview",
    tone: "text-moss bg-moss/10 border-moss/30",
    hex: "#2f6f5e",
    description: "DSA, system design, STAR behavioral stories, mock loops."
  }
};

export const PHASES: Phase[] = [
  {
    id: 1,
    name: "Foundation & Audit",
    range: [1, 30],
    description: "IELTS baseline, CRS/ECA start, codebase audit, fundamentals, STAR drafts."
  },
  {
    id: 2,
    name: "Building & Momentum",
    range: [31, 60],
    description: "Refactoring, medium DSA, profile setup, PNP research, weekly mocks."
  },
  {
    id: 3,
    name: "Mastery & Submission",
    range: [61, 90],
    description: "IELTS exam readiness, Express Entry live, redesigned sites, full interview loops."
  }
];

export function phaseForDay(day: number): Phase {
  const phase = PHASES.find((p) => day >= p.range[0] && day <= p.range[1]);
  return phase ?? PHASES[0];
}

export const TOTAL_DAYS = 90;
