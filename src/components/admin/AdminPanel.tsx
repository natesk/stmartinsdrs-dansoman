'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Trash2, RotateCcw, BrainCircuit, BarChart } from 'lucide-react';
import SuggestShifts from './ai/SuggestShifts';
import AnalyzeSignups from './ai/AnalyzeSignups';

export default function AdminPanel() {
  const { doctors, addDoctor, removeDoctor, resetRoster } = useApp();
  const [newDoctorName, setNewDoctorName] = useState('');
  const { toast } = useToast();

  const handleAddDoctor = async () => {
    if (!newDoctorName.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Doctor name cannot be empty.' });
      return;
    }
    try {
      await addDoctor(newDoctorName);
      setNewDoctorName('');
      toast({ title: 'Success', description: 'Doctor added successfully.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add doctor.' });
    }
  };

  const handleRemoveDoctor = async (name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}? They will be removed from all shifts.`)) {
        try {
            await removeDoctor(name);
            toast({ title: 'Success', description: `${name} has been removed.` });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: `Failed to remove ${name}.` });
        }
    }
  };

  const handleResetRoster = async () => {
    if (window.confirm('Are you sure you want to reset the entire weekly roster? This cannot be undone.')) {
        try {
            await resetRoster();
            toast({ title: 'Success', description: 'The roster has been reset.' });
        } catch (error) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to reset the roster.' });
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manage Doctors */}
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center"><UserPlus className="mr-2"/>Manage Doctors</CardTitle>
                <CardDescription>Add or remove doctors from the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={newDoctorName}
                        onChange={(e) => setNewDoctorName(e.target.value)}
                        placeholder="e.g., Dr. Jane Smith"
                    />
                    <Button onClick={handleAddDoctor} size="icon"><UserPlus /></Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {doctors?.names.map((name) => (
                        <div key={name} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                            <p className="text-sm text-secondary-foreground">{name}</p>
                            <Button onClick={() => handleRemoveDoctor(name)} variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* AI Tools */}
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center"><BrainCircuit className="mr-2"/>AI Rostering Tools</CardTitle>
                <CardDescription>Use AI to analyze and improve the schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <SuggestShifts />
                 <AnalyzeSignups />
            </CardContent>
        </Card>

        {/* Roster Management */}
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center"><RotateCcw className="mr-2"/>Roster Management</CardTitle>
                <CardDescription>Perform administrative actions on the roster.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleResetRoster} variant="destructive" className="w-full">
                    Reset Weekly Roster
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
