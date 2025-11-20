'use client';

import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { Hospital, LogOut, UserCircle } from 'lucide-react';

export default function Header() {
  const { user, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Hospital className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">ShiftSync Pro</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCircle className="h-5 w-5" />
          <span>{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
