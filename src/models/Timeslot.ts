import { z } from 'zod';

export const Timeslot = z.object({
  id: z.string(),
  start: z.string(),
  end: z.string(),
  userId: z.string(),
});
