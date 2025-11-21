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
        'h-full w-full p-2 rounded-lg cursor-pointer transition-all duration-300 flex flex-col justify-between border-2',
        'hover:shadow-lg hover:shadow-primary/40 hover:border-primary/60',
        isUserInShift
          ? 'bg-primary/20 border-primary/80 shadow-inner shadow-primary/30'
          : 'bg-secondary/50 hover:bg-secondary/80 border-transparent',
        filledSlots >= slots && !isUserInShift ? 'bg-muted/50 cursor-not-allowed hover:shadow-none hover:border-transparent' : ''
      )}
    >
      <div className="flex-grow space-y-1 overflow-y-auto">
        {applicants.map((name) => (
          <div
            key={name}
            className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full truncate text-center',
              name === user?.name
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-background/70 text-foreground'
            )}
          >
            {name.replace('Dr. ', '')}
          </div>
        ))}
      </div>
       <div className="flex items-center justify-between pt-2">
         <span className="text-xs font-mono text-muted-foreground">{filledSlots}/{slots}</span>
        <Progress value={progress} className="h-1.5 w-1/2" />
      </div>
    </div>
  );
}