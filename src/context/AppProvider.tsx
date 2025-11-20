'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Roster, Doctors } from '@/lib/types';
import { INITIAL_ROSTER, INITIAL_DOCTORS } from '@/lib/initial-data';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User | null;
  roster: Roster | null;
  doctors: Doctors | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateRoster: (day: string, shift: string, applicants: string[]) => Promise<void>;
  addDoctor: (name: string) => Promise<void>;
  removeDoctor: (name: string) => Promise<void>;
  resetRoster: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roster, setRoster] = useState<Roster | null>(null);
  const [doctors, setDoctors] = useState<Doctors | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);

    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    const doctorsDocRef = doc(db, 'doctors', 'list');

    const unsubscribeRoster = onSnapshot(rosterDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setRoster(docSnap.data() as Roster);
      } else {
        await setDoc(rosterDocRef, INITIAL_ROSTER);
        setRoster(INITIAL_ROSTER);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching roster:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch roster data.' });
      setLoading(false);
    });

    const unsubscribeDoctors = onSnapshot(doctorsDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        setDoctors(docSnap.data() as Doctors);
      } else {
        const initialData = { names: INITIAL_DOCTORS };
        await setDoc(doctorsDocRef, initialData);
        setDoctors(initialData);
      }
    }, (error) => {
      console.error("Error fetching doctors:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch doctor list.' });
    });

    return () => {
      unsubscribeRoster();
      unsubscribeDoctors();
    };
  }, [toast]);

  const login = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateRoster = async (day: string, shift: string, applicants: string[]) => {
    if (!roster) return;
    const newRoster = { ...roster };
    newRoster[day][shift].applicants = applicants;
    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    await setDoc(rosterDocRef, newRoster, { merge: true });
  };
    
  const addDoctor = async (name: string) => {
    if (!doctors) return;
    const newDoctors = { names: [...doctors.names, name] };
    const doctorsDocRef = doc(db, 'doctors', 'list');
    await setDoc(doctorsDocRef, newDoctors);
  };

  const removeDoctor = async (name: string) => {
    if (!doctors || !roster) return;
    const newDoctors = { names: doctors.names.filter(d => d !== name) };
    const doctorsDocRef = doc(db, 'doctors', 'list');
    await setDoc(doctorsDocRef, newDoctors);

    // Also remove doctor from all shifts
    const newRoster = { ...roster };
    Object.keys(newRoster).forEach(day => {
        Object.keys(newRoster[day]).forEach(shift => {
            newRoster[day][shift].applicants = newRoster[day][shift].applicants.filter( (d:string) => d !== name);
        });
    });
    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    await setDoc(rosterDocRef, newRoster);
  };
    
  const resetRoster = async () => {
    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    await setDoc(rosterDocRef, INITIAL_ROSTER);
  }

  const value = {
    user,
    roster,
    doctors,
    loading,
    login,
    logout,
    updateRoster,
    addDoctor,
    removeDoctor,
    resetRoster
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
