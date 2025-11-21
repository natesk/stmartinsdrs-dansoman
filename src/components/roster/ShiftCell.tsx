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
        'h-full w-full p-2 rounded-md cursor-pointer transition-all duration-200 flex flex-col justify-between border',
        'hover:bg-primary/20 hover:border-primary/80',
        isUserInShift
          ? 'bg-primary/20 border-primary'
          : 'bg-white/5 border-transparent',
        filledSlots >= slots && !isUserInShift ? 'bg-muted/30 cursor-not-allowed hover:bg-muted/30 hover:border-transparent' : ''
      )}
    >
      <div className="flex-grow space-y-1 overflow-y-auto pr-1">
        {applicants.map((name) => (
          <div
            key={name}
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full truncate text-center',
              name === user?.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-foreground/80'
            )}
          >
            {name.replace('Dr. ', '')}
          </div>
        ))}
      </div>
       <div className="flex items-center justify-between pt-2">
         <span className="text-xs font-mono text-muted-foreground">{filledSlots}/{slots}</span>
        <Progress value={progress} className="h-1.5 w-1/2 bg-white/10" />
      </div>
    </div>
  );
}
