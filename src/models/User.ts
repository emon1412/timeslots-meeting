import { z } from 'zod';

export const User = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  timezone: z.enum(['ET', 'CT', 'MT', 'PT', 'AK', 'HI']), // US timezones
});
