import { z } from 'zod';
import * as m from '../models';

export type User = z.infer<typeof m.User>;
export type Meeting = z.infer<typeof m.Meeting>;
export type Timeslot = z.infer<typeof m.Timeslot>;
