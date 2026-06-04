import { dateForDay, fullPlan } from "./plan";
import type { SkillTrackerState } from "./types";

export function exportJson(state: SkillTrackerState): string {
  return JSON.stringify(
    { exportedAt: new Date().toISOString(), state },
    null,
    2
  );
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportCsv(state: SkillTrackerState): string {
  const plan = fullPlan(state.startDate);
  const rows: string[] = [
    ["day", "date", "track", "kind", "title", "minutes_planned", "completed", "minutes_actual", "note"].join(",")
  ];
  for (const dayPlan of plan) {
    const date = dateForDay(state.startDate, dayPlan.day);
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    for (const task of dayPlan.tasks) {
      const completion = state.completions[task.id];
      rows.push(
        [
          dayPlan.day,
          isoDate,
          task.track,
          task.kind,
          escapeCsv(task.title),
          task.minutesPlanned,
          completion ? "yes" : "no",
          completion?.minutesActual ?? "",
          escapeCsv(completion?.note ?? "")
        ].join(",")
      );
    }
  }
  return rows.join("\n");
}

function icsDate(date: Date, hour: number, minute: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(hour)}${pad(minute)}00`;
}

function icsLine(line: string): string {
  // Fold at 75 octets per RFC 5545; we are mostly ASCII so length is fine.
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function icsEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/**
 * Schedules each task on its plan date starting at 18:00, back-to-back.
 * Calendars consume this as a sequence of 25-120 minute blocks.
 */
export function exportIcs(state: SkillTrackerState): string {
  const plan = fullPlan(state.startDate);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Abhey//90-Day Skill Tracker//EN",
    "CALSCALE:GREGORIAN"
  ];
  let serial = 0;
  for (const dayPlan of plan) {
    const date = dateForDay(state.startDate, dayPlan.day);
    let cursor = 18 * 60; // 18:00 in minutes
    for (const task of dayPlan.tasks) {
      const startHour = Math.floor(cursor / 60);
      const startMin = cursor % 60;
      const endMinutes = cursor + task.minutesPlanned;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      // If a single task pushes past midnight, clamp to 23:59 to keep ICS valid.
      const safeEndHour = Math.min(endHour, 23);
      const safeEndMin = endHour > 23 ? 59 : endMin;
      serial++;
      lines.push("BEGIN:VEVENT");
      lines.push(icsLine(`UID:skill-tracker-${dayPlan.day}-${serial}@abhey.local`));
      lines.push(icsLine(`SUMMARY:${icsEscape(task.title)}`));
      lines.push(icsLine(`DESCRIPTION:${icsEscape(task.description)}`));
      lines.push(`DTSTART:${icsDate(date, startHour, startMin)}`);
      lines.push(`DTEND:${icsDate(date, safeEndHour, safeEndMin)}`);
      lines.push("END:VEVENT");
      cursor = endMinutes;
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
