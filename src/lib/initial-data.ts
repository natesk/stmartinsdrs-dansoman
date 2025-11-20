import type { Roster } from './types';

export const ADMIN_PIN = "152035";

export const INITIAL_DOCTORS = [
  "Dr. Osabutey",
  "Dr. Anaximander",
  "Dr. Amegashie",
  "Dr. Deh",
  "Dr. Baah",
  "Dr. Akagbo",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const shifts = ["Morning", "Afternoon", "Night"];
const weekday = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);

export const INITIAL_ROSTER: Roster = daysOfWeek.reduce((acc, day) => {
    acc[day] = shifts.reduce((shiftAcc, shift) => {
        const slots = (shift === "Morning" && weekday.has(day)) ? 2 : 1;
        shiftAcc[shift] = { applicants: [], slots };
        return shiftAcc;
    }, {} as { [key: string]: { applicants: string[], slots: number } });
    return acc;
}, {} as Roster);
