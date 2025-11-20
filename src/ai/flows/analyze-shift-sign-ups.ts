'use server';

/**
 * @fileOverview Analyzes shift sign-up patterns to identify potential schedule shortages.
 *
 * - analyzeShiftSignUps - A function that analyzes shift sign-up data.
 * - AnalyzeShiftSignUpsInput - The input type for the analyzeShiftSignUps function.
 * - AnalyzeShiftSignUpsOutput - The return type for the analyzeShiftSignUps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeShiftSignUpsInputSchema = z.object({
  rosterData: z
    .string()
    .describe('JSON string representing the current roster data.'),
});
export type AnalyzeShiftSignUpsInput = z.infer<typeof AnalyzeShiftSignUpsInputSchema>;

const AnalyzeShiftSignUpsOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'A detailed analysis of shift sign-up patterns, highlighting potential shortages and their likely causes.'
    ),
});
export type AnalyzeShiftSignUpsOutput = z.infer<typeof AnalyzeShiftSignUpsOutputSchema>;

export async function analyzeShiftSignUps(input: AnalyzeShiftSignUpsInput): Promise<AnalyzeShiftSignUpsOutput> {
  return analyzeShiftSignUpsFlow(input);
}

const analyzeShiftSignUpsPrompt = ai.definePrompt({
  name: 'analyzeShiftSignUpsPrompt',
  input: {schema: AnalyzeShiftSignUpsInputSchema},
  output: {schema: AnalyzeShiftSignUpsOutputSchema},
  prompt: `You are a rostering expert, and are analyzing clinic shift data for a clinical coordinator.

Analyze the following roster data and identify any patterns of low shift sign-ups that may indicate potential schedule shortages. Consider factors such as shift times, days of the week, and any other relevant information that may be contributing to the shortages.

Roster Data: {{{rosterData}}}

Provide a detailed analysis of the potential shortages, including specific shifts or time periods that are likely to be understaffed and potential reasons for these shortages.
`,
});

const analyzeShiftSignUpsFlow = ai.defineFlow(
  {
    name: 'analyzeShiftSignUpsFlow',
    inputSchema: AnalyzeShiftSignUpsInputSchema,
    outputSchema: AnalyzeShiftSignUpsOutputSchema,
  },
  async input => {
    const {output} = await analyzeShiftSignUpsPrompt(input);
    return output!;
  }
);

