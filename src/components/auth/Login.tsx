'use client';

import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PinModal from '@/components/auth/PinModal';
import { Hospital } from 'lucide-react';

export default function Login() {
  const { doctors, login } = useApp();
  const [selectedDoctor, setSelectedDoctor] = useState('');
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

  const handleCoordinatorLogin = () => {
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    login({ name: 'Clinical Coordinator', role: 'Clinical Coordinator' });
     toast({
      title: 'Login Successful',
      description: 'Welcome, Coordinator!',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-2">
              <Hospital className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight">ShiftSync Pro</CardTitle>
           </div>
          <CardDescription>Medical Staff Scheduling System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-center">Doctor Login</h3>
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
              Login
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

          <Button onClick={handleCoordinatorLogin} variant="secondary" className="w-full">
            Clinical Coordinator Login
          </Button>
        </CardContent>
      </Card>
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
}
