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
        'hover:border-primary',
        isUserInShift
          ? 'bg-blue-100 border-primary'
          : 'bg-gray-50 border-transparent',
        filledSlots >= slots && !isUserInShift ? 'bg-gray-200 cursor-not-allowed hover:border-transparent' : ''
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
                : 'bg-secondary text-secondary-foreground'
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
