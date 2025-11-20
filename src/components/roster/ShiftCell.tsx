'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { TableCell } from '@/components/ui/table';
import ShiftModal from './ShiftModal';
import { cn } from '@/lib/utils';
import { Bed, Sun, Sunset } from 'lucide-react';

const ShiftIcon = ({ shift }: { shift: string }) => {
    switch (shift) {
        case 'Morning Shift':
            return <Sun className="mr-2 h-4 w-4 text-yellow-500" />;
        case 'Afternoon Shift':
            return <Sunset className="mr-2 h-4 w-4 text-orange-500" />;
        case 'Night Shift':
            return <Bed className="mr-2 h-4 w-4 text-blue-500" />;
        default:
            return null;
    }
};

export default function ShiftCell({ day, shift }: { day: string; shift: string }) {
  const { roster, user } = useApp();
  const [isModalOpen, setModalOpen] = useState(false);

  const shiftData = roster?.[day]?.[shift];
  const applicants = shiftData?.applicants || [];
  const isUserInShift = user ? applicants.includes(user.name) : false;

  return (
    <>
      <TableCell
        className={cn(
          'cursor-pointer border p-2 text-center transition-colors hover:bg-accent/20',
          isUserInShift && 'bg-primary/20 hover:bg-primary/30'
        )}
        onClick={() => setModalOpen(true)}
      >
        <div className="flex items-center justify-center mb-1">
            <ShiftIcon shift={shift} />
            <span className="font-semibold text-xs">{applicants.length} / 2</span>
        </div>
        <div className="space-y-1">
          {applicants.map((name) => (
            <div
              key={name}
              className={cn(
                'rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground',
                name === user?.name && 'bg-primary text-primary-foreground font-bold'
              )}
            >
              {name.replace('Dr. ', '')}
            </div>
          ))}
        </div>
      </TableCell>
      {shiftData && (
        <ShiftModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          day={day}
          shift={shift}
          shiftData={shiftData}
        />
      )}
    </>
  );
}
