import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-under-scheduled.ts';
import '@/ai/flows/analyze-shift-sign-ups.ts';
import '@/ai/flows/real-time-roster-updates.ts';