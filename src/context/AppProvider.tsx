'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import type { User, Roster, Doctors } from '@/lib/types';
import { getInitialRoster, INITIAL_DOCTORS } from '@/lib/initial-data';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User | null;
  roster: Roster | null;
  doctors: Doctors | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateRoster: (day: string, shift: string, newApplicants: string[]) => Promise<void>;
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
    const doctorsDocRef = doc(db, 'doctors', 'list');
    const rosterDocRef = doc(db, 'roster', 'currentWeek');

    const initializeData = async () => {
      try {
        const doctorsDoc = await getDoc(doctorsDocRef);
        if (!doctorsDoc.exists()) {
          await setDoc(doctorsDocRef, { names: INITIAL_DOCTORS });
        }

        const rosterDoc = await getDoc(rosterDocRef);
        if (!rosterDoc.exists()) {
          await setDoc(rosterDocRef, getInitialRoster());
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Could not initialize application data.",
        });
      }
    };

    initializeData();

    const unsubDoctors = onSnapshot(doctorsDocRef, (doc) => {
      if (doc.exists()) {
        setDoctors(doc.data() as Doctors);
      }
    }, (error) => {
      console.error("Error fetching doctors:", error);
      toast({
        variant: "destructive",
        title: "Data Error",
        description: "Could not load doctor list.",
      });
    });

    const unsubRoster = onSnapshot(rosterDocRef, (doc) => {
      if (doc.exists()) {
        setRoster(doc.data() as Roster);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching roster:", error);
      toast({
        variant: "destructive",
        title: "Data Error",
        description: "Could not load roster.",
      });
      setLoading(false);
    });

    return () => {
      unsubDoctors();
      unsubRoster();
    };
  }, [toast]);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const updateRoster = async (day: string, shift: string, newApplicants: string[]) => {
    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    const fieldPath = `${day}.${shift}.applicants`;
    try {
      await updateDoc(rosterDocRef, { [fieldPath]: newApplicants });
    } catch (error) {
      console.error("Error updating roster:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the shift.",
      });
    }
  };

  const addDoctor = async (name: string) => {
    const doctorsDocRef = doc(db, 'doctors', 'list');
    try {
      await updateDoc(doctorsDocRef, { names: arrayUnion(name) });
      toast({
        title: "Doctor Added",
        description: `${name} has been added to the list.`,
      });
    } catch (error) {
      console.error("Error adding doctor:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not add the new doctor.",
      });
    }
  };

  const removeDoctor = async (name: string) => {
    const doctorsDocRef = doc(db, 'doctors', 'list');
    const rosterDocRef = doc(db, 'roster', 'currentWeek');

    try {
      // Remove from doctors list
      await updateDoc(doctorsDocRef, { names: arrayRemove(name) });

      // Remove from all shifts
      const currentRoster = roster;
      if (currentRoster) {
        const updatedRoster: Roster = JSON.parse(JSON.stringify(currentRoster));
        for (const day in updatedRoster) {
          for (const shift in updatedRoster[day]) {
            updatedRoster[day][shift].applicants = updatedRoster[day][shift].applicants.filter(
              (applicant) => applicant !== name
            );
          }
        }
        await setDoc(rosterDocRef, updatedRoster);
      }

      toast({
        title: "Doctor Removed",
        description: `${name} has been removed and withdrawn from all shifts.`,
      });
    } catch (error) {
      console.error("Error removing doctor:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not remove the doctor.",
      });
    }
  };

  const resetRoster = async () => {
    const rosterDocRef = doc(db, 'roster', 'currentWeek');
    try {
      await setDoc(rosterDocRef, getInitialRoster());
      toast({
        title: "Roster Reset",
        description: "The weekly roster has been cleared.",
      });
    } catch (error) {
      console.error("Error resetting roster:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not reset the roster.",
      });
    }
  };


  return (
    <AppContext.Provider value={{ user, roster, doctors, loading, login, logout, updateRoster, addDoctor, removeDoctor, resetRoster }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
