'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Hospital } from 'lucide-react';
import PinModal from './PinModal';

export default function Login() {
  const { doctors, login } = useApp();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDoctorLogin = () => {
    if (!selectedDoctor) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please select your name from the list.',
      });
      return;
    }
    login({ name: selectedDoctor, role: 'Doctor' });
    toast({
      title: 'Login Successful',
      description: `Welcome, ${selectedDoctor}!`,
    });
  };

  const handleCoordinatorLoginSuccess = () => {
    login({ name: 'Clinical Coordinator', role: 'Clinical Coordinator' });
    toast({
      title: 'Admin Login Successful',
      description: 'Welcome, Clinical Coordinator!',
    });
    setPinModalOpen(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Hospital className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">ShiftSync Pro</CardTitle>
          <CardDescription>Real-time medical staff rostering.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Doctor Login</h3>
            <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Select your name..." />
              </SelectTrigger>
              <SelectContent>
                {doctors?.names.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleDoctorLogin} className="w-full">
              Login as Doctor
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Coordinator Login</h3>
            <Button onClick={() => setPinModalOpen(true)} variant="outline" className="w-full">
              Login as Clinical Coordinator
            </Button>
          </div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">Select your role to access the schedule.</p>
        </CardFooter>
      </Card>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handleCoordinatorLoginSuccess}
      />
    </div>
  );
}
