'use client';

import { useApp } from '@/context/AppProvider';
import { cn } from '@/lib/utils';
import type { Shift } from '@/lib/types';
import { SLOTS_PER_SHIFT } from '@/lib/initial-data';
import { Progress } from '@/components/ui/progress';

interface ShiftCellProps {
  shiftData: Shift;
  onClick: () => void;
}

export default function ShiftCell({ shiftData, onClick }: ShiftCellProps) {
  const { user } = useApp();
  const { applicants } = shiftData;
  const filledSlots = applicants.length;
  const progress = (filledSlots / SLOTS_PER_SHIFT) * 100;
  const isUserInShift = user ? applicants.includes(user.name) : false;

  return (
    <div
      onClick={onClick}
      className={cn(
        'h-full w-full p-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-between border-2',
        isUserInShift
          ? 'bg-primary/10 border-primary shadow-inner'
          : 'bg-card hover:bg-accent/50 border-transparent',
        filledSlots >= SLOTS_PER_SHIFT && !isUserInShift ? 'bg-muted/50 cursor-not-allowed' : ''
      )}
    >
      <div className="flex-grow space-y-1">
        {applicants.map((name) => (
          <div
            key={name}
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full truncate',
              name === user?.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {name.replace('Dr. ', '')}
          </div>
        ))}
      </div>
      <div className="pt-1">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
