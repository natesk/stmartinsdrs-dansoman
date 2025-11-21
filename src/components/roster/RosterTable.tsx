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
      <Card className="overflow-hidden bg-black/30 backdrop-blur-lg border-white/10 shadow-xl shadow-black/20">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-b-white/10 hover:bg-transparent">
                  <TableHead className="w-[150px] font-bold text-base text-white/90">Shift</TableHead>
                  {daysOfWeek.map((day) => (
                    <TableHead key={day} className="text-center font-bold text-base text-white/90 min-w-[120px]">{day}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift} className="border-b-white/10 last:border-b-0 hover:bg-transparent">
                    <TableCell className="font-semibold flex items-center text-sm text-white/80">
                      {shiftIcons[shift as keyof typeof shiftIcons]}
                      {shift}
                    </TableCell>
                    {daysOfWeek.map((day) => {
                      const shiftData = roster?.[day]?.[shift];
                      return (
                        <TableCell key={`${day}-${shift}`} className="p-1 h-36">
                          {shiftData ? (
                            <ShiftCell
                              shiftData={shiftData}
                              onClick={() => handleCellClick(day, shift, shiftData)}
                            />
                          ) : <div className="h-full w-full"></div>}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
