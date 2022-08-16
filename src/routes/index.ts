import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import CreateUserRoute from './CreateUserRoute';
import CreateMeetingRoute from './CreateMeetingRoute';
import CreateTimeslotRoute from './CreateTimeslotRoute';
import GetTimeslotsRoute from './GetTimeslotsRoute';
import UpdateUserRoute from './UpdateUserRoute';

const routes = [
  CreateUserRoute,
  CreateTimeslotRoute,
  GetTimeslotsRoute,
  CreateMeetingRoute,
  UpdateUserRoute,
];

export default fp(async (app: FastifyInstance) => {
  for (const route of routes) {
    app.register(route);
  }
});
