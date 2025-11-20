'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestShiftsForUnderScheduledDoctors, type SuggestShiftsOutput } from '@/ai/flows/suggest-under-scheduled';
import { SLOTS_PER_SHIFT } from '@/lib/initial-data';
import { LoaderCircle, UserCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function SuggestShifts() {
  const { roster, doctors } = useApp();
  const [suggestions, setSuggestions] = useState<SuggestShiftsOutput>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestShifts = async () => {
    if (!roster || !doctors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Roster or doctor data is not available.',
      });
      return;
    }

    setLoading(true);
    setSuggestions([]);

    try {
      const result = await suggestShiftsForUnderScheduledDoctors({
        doctors: doctors.names,
        roster: roster,
        slotsPerShift: SLOTS_PER_SHIFT,
      });
      setSuggestions(result);
       if (result.length === 0) {
        toast({
            title: "No Suggestions",
            description: "All doctors seem to be scheduled evenly.",
        });
      }
    } catch (error) {
      console.error('Error suggesting shifts:', error);
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: 'Could not generate shift suggestions.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleSuggestShifts} disabled={loading} className="w-full">
        {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
        Suggest for Under-scheduled
      </Button>
      {suggestions.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          {suggestions.map((suggestion, index) => (
            <AccordionItem value={`item-${index}`} key={suggestion.doctor}>
              <AccordionTrigger>
                <div className="flex items-center">
                  <UserCheck className="mr-2 h-4 w-4 text-accent" />
                  {suggestion.doctor}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {suggestion.suggestedShifts.map((shift, i) => (
                    <li key={i}>{shift}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
