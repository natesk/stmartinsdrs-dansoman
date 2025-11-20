import type { Roster } from './types';

export const ADMIN_PIN = "1234";

export const SLOTS_PER_SHIFT = 2;

export const INITIAL_DOCTORS = [
  "Dr. Eleanor Vance",
  "Dr. Marcus Thorne",
  "Dr. Amelia Reed",
  "Dr. Julian Cross",
  "Dr. Lena Petrova",
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const shifts = ["Morning", "Afternoon", "Night"];

export const INITIAL_ROSTER: Roster = daysOfWeek.reduce((acc, day) => {
    acc[day] = shifts.reduce((shiftAcc, shift) => {
        shiftAcc[shift] = { applicants: [] };
        return shiftAcc;
    }, {} as { [key: string]: { applicants: string[] } });
    return acc;
}, {} as Roster);
