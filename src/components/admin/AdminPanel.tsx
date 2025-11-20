'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, UserX, Trash2, BrainCircuit, LineChart } from 'lucide-react';
import AnalyzeSignups from './ai/AnalyzeSignups';
import SuggestShifts from './ai/SuggestShifts';

export default function AdminPanel() {
  const { doctors, addDoctor, removeDoctor, resetRoster } = useApp();
  const [newDoctorName, setNewDoctorName] = useState('');
  const { toast } = useToast();

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName.startsWith('Dr. ')) {
      toast({
        variant: 'destructive',
        title: 'Invalid Name',
        description: 'Doctor name must start with "Dr. ".',
      });
      return;
    }
    if (doctors?.names.includes(newDoctorName)) {
      toast({
        variant: 'destructive',
        title: 'Doctor Exists',
        description: `${newDoctorName} is already on the list.`,
      });
      return;
    }
    await addDoctor(newDoctorName);
    setNewDoctorName('');
  };

  const handleResetRoster = () => {
    const today = new Date().getDay(); // 0 for Sunday, 6 for Saturday
    if (today !== 0 && today !== 6) {
      toast({
        variant: 'destructive',
        title: 'Action Restricted',
        description: 'The roster can only be reset on weekends (Saturday or Sunday).',
      });
      return;
    }
    resetRoster();
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-semibold text-lg">Manage Doctors</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5"/>Add New Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddDoctor} className="space-y-2">
                    <Label htmlFor="doctor-name">Doctor Name</Label>
                    <Input
                      id="doctor-name"
                      placeholder="e.g., Dr. Jane Doe"
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                    />
                    <Button type="submit" className="w-full">Add Doctor</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><UserX className="mr-2 h-5 w-5"/>Remove Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <ul className="space-y-2">
                      {doctors?.names.map((name) => (
                        <li key={name} className="flex items-center justify-between rounded-md bg-secondary p-2">
                          <span className="text-sm">{name}</span>
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove {name} and withdraw them from all shifts. This action cannot be undone.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeDoctor(name)} className="bg-destructive hover:bg-destructive/90">Remove</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-semibold text-lg">AI Rostering Tools</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><BrainCircuit className="mr-2 h-5 w-5"/>Suggest Shifts</CardTitle>
                  <CardDescription>AI-powered suggestions for under-scheduled doctors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SuggestShifts />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><LineChart className="mr-2 h-5 w-5"/>Analyze Sign-up Patterns</CardTitle>
                   <CardDescription>Identify trends and potential future staff shortages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AnalyzeSignups />
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="font-semibold text-lg">System Actions</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Trash2 className="mr-2 h-5 w-5 text-destructive"/>Reset Roster</CardTitle>
                  <CardDescription>Clear all shift sign-ups for the week. This can only be done on weekends.</CardDescription>
                </CardHeader>
                <CardContent>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">Reset Entire Roster</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will clear the entire weekly roster, removing all doctors from all shifts. This is irreversible.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetRoster} className="bg-destructive hover:bg-destructive/90">Yes, reset it</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
}
