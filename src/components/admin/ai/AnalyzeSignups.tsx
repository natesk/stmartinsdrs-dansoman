'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppProvider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { analyzeShiftSignUps } from '@/ai/flows/analyze-shift-sign-ups';
import { LoaderCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalyzeSignups() {
  const { roster } = useApp();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!roster) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Roster data is not available.',
      });
      return;
    }

    setLoading(true);
    setAnalysis('');

    try {
      const result = await analyzeShiftSignUps({
        rosterData: JSON.stringify(roster),
      });
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Error analyzing sign-ups:', error);
      toast({
        variant: 'destructive',
        title: 'AI Analysis Failed',
        description: 'Could not generate the analysis.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAnalysis} disabled={loading} className="w-full">
        {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
        Analyze Sign-up Patterns
      </Button>
      {analysis && (
        <Card className="bg-secondary">
          <CardContent className="p-4">
            <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{analysis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
