import type { FastifyRequest } from 'fastify';
import * as m from './modelTypes';

export type CreateUserRequest = FastifyRequest<{
  Body: m.User
}>;

export type CreateMeetingRequest = FastifyRequest<{
  Body: m.Meeting
}>;

export type CreateTimeslotRequest = FastifyRequest<{
  Body: m.Timeslot
}>;

export type GetTimeslotsRequest = FastifyRequest<{
  Params: {
    userId: string
  }
}>;

export type UpdateUserRequest = FastifyRequest<{
  Params: {
    userId: string
  },
  Body: Omit<m.User, 'id'>
}>;
