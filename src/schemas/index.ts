import { FastifyInstance } from 'fastify';
import user from './user';
import meeting from './meeting';
import timeslot from './timeslot';
import dateTime from './dateTime';

const schemas = [
  user,
  meeting,
  timeslot,
  dateTime,
];

export default (app: FastifyInstance) => {
  for (const schema of schemas) {
    console.info(`Initialization: schema ${schema.$id} added.`);
    app.addSchema(schema);
  }
};
