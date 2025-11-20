'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestUnderScheduledDoctors } from '@/ai/flows/suggest-under-scheduled';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SuggestShifts() {
  const { doctors, roster } = useApp();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    if (!roster || !doctors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Roster and doctor data are not available.',
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const result = await suggestUnderScheduledDoctors({
        doctorNames: doctors.names,
        rosterData: JSON.stringify(roster),
      });
      setSuggestions(result.suggestedDoctors);
    } catch (error) {
      console.error('Error suggesting doctors:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate suggestions.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleSuggest} disabled={loading} className="w-full">
        {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
        Suggest Doctors for Empty Shifts
      </Button>
      {suggestions.length > 0 && (
        <Card className="bg-secondary">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-secondary-foreground">Suggested Doctors:</h4>
            <ul className="list-disc pl-5 space-y-1 text-secondary-foreground">
              {suggestions.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
