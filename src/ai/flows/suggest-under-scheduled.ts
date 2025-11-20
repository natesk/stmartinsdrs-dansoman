'use server';

/**
 * @fileOverview An AI agent for suggesting shifts for under-scheduled doctors.
 *
 * - suggestShiftsForUnderScheduledDoctors - A function that suggests shifts for under-scheduled doctors.
 * - SuggestShiftsInput - The input type for the suggestShiftsForUnderScheduledDoctors function.
 * - SuggestShiftsOutput - The return type for the suggestShiftsForUnderScheduledDoctors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestShiftsInputSchema = z.object({
  doctors: z.array(z.string()).describe('List of all doctor names.'),
  roster: z.record(z.any()).describe('The current roster data.'),
  slotsPerShift: z.number().describe('The number of doctors per shift.'),
});
export type SuggestShiftsInput = z.infer<typeof SuggestShiftsInputSchema>;

const SuggestShiftsOutputSchema = z.array(z.object({
  doctor: z.string().describe('The name of the doctor.'),
  suggestedShifts: z.array(z.string()).describe('Suggested shifts for the doctor.'),
})).describe('List of suggested shifts for under-scheduled doctors.');
export type SuggestShiftsOutput = z.infer<typeof SuggestShiftsOutputSchema>;

export async function suggestShiftsForUnderScheduledDoctors(input: SuggestShiftsInput): Promise<SuggestShiftsOutput> {
  return suggestShiftsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShiftsPrompt',
  input: {schema: SuggestShiftsInputSchema},
  output: {schema: SuggestShiftsOutputSchema},
  prompt: `You are a clinical coordinator assistant. You are provided with a list of doctors, the current roster, and the number of slots per shift.

  Your goal is to identify doctors who are under-scheduled and suggest shifts for them.

  Doctors: {{doctors}}
  Roster: {{roster}}
  Slots Per Shift: {{slotsPerShift}}

  Analyze the roster and suggest shifts for doctors who have fewer shifts than the average. Provide a list of suggested shifts for each doctor.
  Return a JSON array where each object has doctor and suggestedShifts field. The suggested shifts should be strings describing the day and shift such as 'Monday Morning Shift'.
  `,
});

const suggestShiftsFlow = ai.defineFlow(
  {
    name: 'suggestShiftsFlow',
    inputSchema: SuggestShiftsInputSchema,
    outputSchema: SuggestShiftsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
