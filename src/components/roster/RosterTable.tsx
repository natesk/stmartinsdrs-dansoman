'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import ShiftCell from './ShiftCell';
import ShiftModal from './ShiftModal';
import type { Shift } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sun, CloudSun, Moon } from 'lucide-react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shifts = ['Morning', 'Afternoon', 'Night'];
const shiftIcons = {
  Morning: <Sun className="mr-2 h-5 w-5 text-yellow-400" />,
  Afternoon: <CloudSun className="mr-2 h-5 w-5 text-orange-400" />,
  Night: <Moon className="mr-2 h-5 w-5 text-indigo-400" />,
};


export default function RosterTable() {
  const { roster } = useApp();
  const [modalState, setModalState] = useState<{ isOpen: boolean; day: string; shift: string; shiftData: Shift | null }>({
    isOpen: false,
    day: '',
    shift: '',
    shiftData: null,
  });

  const handleCellClick = (day: string, shift: string, shiftData: Shift) => {
    setModalState({ isOpen: true, day, shift, shiftData });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, day: '', shift: '', shiftData: null });
  };

  return (
    <>
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b-white/10">
                <TableHead className="w-[120px] font-bold text-lg">Shift</TableHead>
                {daysOfWeek.map((day) => (
                  <TableHead key={day} className="text-center font-bold text-lg">{day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift} className="border-b-white/10 last:border-b-0">
                  <TableCell className="font-semibold flex items-center text-base">
                    {shiftIcons[shift as keyof typeof shiftIcons]}
                    {shift}
                  </TableCell>
                  {daysOfWeek.map((day) => {
                    const shiftData = roster?.[day]?.[shift];
                    return (
                      <TableCell key={`${day}-${shift}`} className="p-1 h-32">
                        {shiftData ? (
                          <ShiftCell
                            shiftData={shiftData}
                            onClick={() => handleCellClick(day, shift, shiftData)}
                          />
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {modalState.isOpen && modalState.shiftData && (
        <ShiftModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          day={modalState.day}
          shift={modalState.shift}
          shiftData={modalState.shiftData}
        />
      )}
    </>
  );
}