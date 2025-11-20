'use client';

import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Shift } from '@/lib/types';
import { SLOTS_PER_SHIFT } from '@/lib/initial-data';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, UserMinus, Users } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string;
  shift: string;
  shiftData: Shift;
}

export default function ShiftModal({ isOpen, onClose, day, shift, shiftData }: ShiftModalProps) {
  const { user, updateRoster } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const { applicants } = shiftData;
  const isUserInShift = applicants.includes(user.name);
  const isShiftFull = applicants.length >= SLOTS_PER_SHIFT;
  const canSignUp = user.role === 'Doctor' && !isUserInShift && !isShiftFull;
  const canWithdraw = user.role === 'Doctor' && isUserInShift;

  const handleSignUp = async () => {
    if (!canSignUp) return;
    const newApplicants = [...applicants, user.name];
    await updateRoster(day, shift, newApplicants);
    toast({
      title: 'Signed Up!',
      description: `You have signed up for the ${shift} on ${day}.`,
    });
    onClose();
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    const newApplicants = applicants.filter((name) => name !== user.name);
    await updateRoster(day, shift, newApplicants);
    toast({
      title: 'Withdrawn',
      description: `You have withdrawn from the ${shift} on ${day}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {shift} - {day}
          </DialogTitle>
          <DialogDescription>
            Manage your sign-up for this shift. Available slots: {SLOTS_PER_SHIFT - applicants.length}/{SLOTS_PER_SHIFT}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h4 className="mb-2 flex items-center font-semibold"><Users className="mr-2 h-4 w-4"/>Doctors Signed Up:</h4>
          {applicants.length > 0 ? (
            <ul className="space-y-2">
              {applicants.map((name) => (
                <li key={name} className="flex items-center justify-between rounded-md bg-secondary p-2">
                  <span className="text-sm text-secondary-foreground">{name}</span>
                  {name === user.name && <Badge variant="outline">You</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No doctors have signed up for this shift yet.</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          {canSignUp && (
            <Button onClick={handleSignUp}>
              <UserPlus className="mr-2 h-4 w-4"/> Sign Up
            </Button>
          )}
          {canWithdraw && (
            <Button onClick={handleWithdraw} variant="destructive">
              <UserMinus className="mr-2 h-4 w-4"/> Withdraw
            </Button>
          )}
          {user.role === 'Clinical Coordinator' && (
             <p className="text-sm text-muted-foreground">Admins cannot sign up for shifts.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
