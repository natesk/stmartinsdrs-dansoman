export type User = {
  name: string;
  role: 'Doctor' | 'Clinical Coordinator';
};

export type Shift = {
  applicants: string[];
  slots: number;
};

export type Day = {
  [shiftName: string]: Shift;
};

export type Roster = {
  [dayName: string]: Day;
};

export type Doctors = {
  names: string[];
};
