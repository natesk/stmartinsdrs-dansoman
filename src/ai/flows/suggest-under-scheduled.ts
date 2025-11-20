'use server';

/**
 * @fileOverview Suggests under-scheduled doctors based on current roster data.
 *
 * - suggestUnderScheduledDoctors - A function that suggests doctors for empty shifts.
 * - SuggestUnderScheduledDoctorsInput - The input type for the function.
 * - SuggestUnderScheduledDoctorsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUnderScheduledDoctorsInputSchema = z.object({
  doctorNames: z.array(z.string()).describe('A list of all available doctor names.'),
  rosterData: z.string().describe('JSON string representing the current weekly roster data.'),
});
export type SuggestUnderScheduledDoctorsInput = z.infer<typeof SuggestUnderScheduledDoctorsInputSchema>;

const SuggestUnderScheduledDoctorsOutputSchema = z.object({
  suggestedDoctors: z
    .array(z.string())
    .describe(
      'A list of doctor names who are identified as being under-scheduled and are suggested to fill empty shifts.'
    ),
});
export type SuggestUnderScheduledDoctorsOutput = z.infer<typeof SuggestUnderScheduledDoctorsOutputSchema>;

export async function suggestUnderScheduledDoctors(input: SuggestUnderScheduledDoctorsInput): Promise<SuggestUnderScheduledDoctorsOutput> {
    return suggestUnderScheduledDoctorsFlow(input);
}


const suggestUnderScheduledDoctorsPrompt = ai.definePrompt({
  name: 'suggestUnderScheduledDoctorsPrompt',
  input: {schema: SuggestUnderScheduledDoctorsInputSchema},
  output: {schema: SuggestUnderScheduledDoctorsOutputSchema},
  prompt: `You are a scheduling assistant for a medical clinic. Your task is to identify doctors who are under-scheduled for the week.

Based on the list of all available doctors and the current roster data, identify up to 3 doctors who have the fewest number of assigned shifts.

Available Doctors: {{{json doctorNames}}}
Current Roster: {{{rosterData}}}

Return a list of the names of the under-scheduled doctors.
`,
});


const suggestUnderScheduledDoctorsFlow = ai.defineFlow(
  {
    name: 'suggestUnderScheduledDoctorsFlow',
    inputSchema: SuggestUnderScheduledDoctorsInputSchema,
    outputSchema: SuggestUnderScheduledDoctorsOutputSchema,
  },
  async (input) => {
    const {output} = await suggestUnderScheduledDoctorsPrompt(input);
    return output!;
  }
);
