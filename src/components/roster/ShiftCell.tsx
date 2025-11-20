'use client';

import { useApp } from '@/context/AppProvider';
import { cn } from '@/lib/utils';
import type { Shift } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface ShiftCellProps {
  shiftData: Shift;
  onClick: () => void;
}

export default function ShiftCell({ shiftData, onClick }: ShiftCellProps) {
  const { user } = useApp();
  const { applicants, slots } = shiftData;
  const filledSlots = applicants.length;
  const progress = (filledSlots / slots) * 100;
  const isUserInShift = user ? applicants.includes(user.name) : false;

  return (
    <div
      onClick={onClick}
      className={cn(
        'h-full w-full p-2 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-between border-2',
        isUserInShift
          ? 'bg-primary/10 border-primary shadow-inner'
          : 'bg-card hover:bg-accent/50 border-transparent',
        filledSlots >= slots && !isUserInShift ? 'bg-muted/50 cursor-not-allowed' : ''
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
       <div className="flex items-center justify-between pt-1">
         <span className="text-xs text-muted-foreground">{filledSlots}/{slots}</span>
        <Progress value={progress} className="h-2 w-1/2" />
      </div>
    </div>
  );
}
