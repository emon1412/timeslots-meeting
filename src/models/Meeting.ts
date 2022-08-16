import { z } from 'zod';

export const Meeting = z.object({
  id: z.string(),
  start: z.string(),
  end: z.string(),
  ownerId: z.string(),
  attendeeId: z.string(),
});
