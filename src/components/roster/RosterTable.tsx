'use client';

import { useApp } from '@/context/AppProvider';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DAYS, SHIFTS } from '@/lib/initial-data';
import ShiftCell from './ShiftCell';

export default function RosterTable() {
  const { roster } = useApp();

  if (!roster) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border-collapse border">
        <TableCaption>Weekly On-Call Roster</TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[150px] border">Shift</TableHead>
            {DAYS.map((day) => (
              <TableHead key={day} className="border text-center">
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {SHIFTS.map((shift) => (
            <TableRow key={shift}>
              <TableHead className="border font-medium">{shift}</TableHead>
              {DAYS.map((day) => (
                <ShiftCell key={`${day}-${shift}`} day={day} shift={shift} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
