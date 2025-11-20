'use server';
/**
 * @fileOverview A flow that utilizes Genkit to reflect changes to the roster in real-time across all users' screens.
 *
 * - realTimeRosterUpdates - A function that triggers the real-time roster update flow.
 * - RealTimeRosterUpdatesInput - The input type for the realTimeRosterUpdates function (currently empty).
 * - RealTimeRosterUpdatesOutput - The return type for the realTimeRosterUpdates function (currently empty).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeRosterUpdatesInputSchema = z.object({});
export type RealTimeRosterUpdatesInput = z.infer<typeof RealTimeRosterUpdatesInputSchema>;

const RealTimeRosterUpdatesOutputSchema = z.object({});
export type RealTimeRosterUpdatesOutput = z.infer<typeof RealTimeRosterUpdatesOutputSchema>;

export async function realTimeRosterUpdates(input: RealTimeRosterUpdatesInput): Promise<RealTimeRosterUpdatesOutput> {
  return realTimeRosterUpdatesFlow(input);
}

const realTimeRosterUpdatesFlow = ai.defineFlow(
  {
    name: 'realTimeRosterUpdatesFlow',
    inputSchema: RealTimeRosterUpdatesInputSchema,
    outputSchema: RealTimeRosterUpdatesOutputSchema,
  },
  async input => {
    // This flow currently does not have any GenAI functionality, as real-time
    // updates are handled directly by Firebase.
    return {};
  }
);
