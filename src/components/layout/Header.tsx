'use client';

import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { Hospital, LogOut, UserCircle } from 'lucide-react';

export default function Header() {
  const { user, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-black/30 backdrop-blur-lg px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Hospital className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-white">ShiftSync Pro</h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCircle className="h-5 w-5 text-primary" />
              <span className="text-white/80">{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out" className="text-white/80 hover:bg-white/10 hover:text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
