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
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border-white/10 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
           <div className="flex justify-center items-center gap-2 mb-4">
              <Hospital className="h-10 w-10 text-primary" />
              <CardTitle className="text-4xl font-bold tracking-tight text-white">ShiftSync Pro</CardTitle>
           </div>
          <CardDescription className="text-blue-200/80">Medical Staff Scheduling System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-center text-lg text-white/90">Doctor Login</h3>
            {doctors && doctors.names && (
              <Select onValueChange={setSelectedDoctor} value={selectedDoctor}>
                <SelectTrigger className="bg-black/40 border-white/20 text-white placeholder:text-gray-400">
                  <SelectValue placeholder="Select your name..." />
                </SelectTrigger>
                <SelectContent className="bg-black/80 backdrop-blur-lg border-white/20 text-white">
                  {doctors.names.map((name) => (
                    <SelectItem key={name} value={name} className="focus:bg-primary/50">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleDoctorLogin} className="w-full" disabled={!doctors}>
              Login
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/0 px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button onClick={handleCoordinatorLogin} variant="secondary" className="w-full bg-secondary/80 hover:bg-secondary">
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
