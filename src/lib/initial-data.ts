import type { Roster } from './types';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SHIFTS = ['Morning Shift', 'Afternoon Shift', 'Night Shift'];
export const SLOTS_PER_SHIFT = 2;
export const ADMIN_PIN = "152035";

export const INITIAL_DOCTORS = [
  'Dr. John Smith',
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Williams',
  'Dr. David Brown',
];

export function getInitialRoster(): Roster {
  const roster: Roster = {};
  for (const day of DAYS) {
    roster[day] = {};
    for (const shift of SHIFTS) {
      roster[day][shift] = {
        applicants: [],
      };
    }
  }
  return roster;
}
