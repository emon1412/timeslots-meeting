import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { FastifyReply } from 'fastify';
import { SCHEMA_NAMES } from '../constants';
import type { CreateTimeslotRequest, ApiError } from '../types';
import CreateTimeslotUseCase from '../useCases/CreateTimeslotUseCase';
import BaseRouteHandler from './BaseRouteHandler';

export class CreateTimeslotRouteHandler extends BaseRouteHandler {
  public uri: string = '/timeslots';

  private useCase: CreateTimeslotUseCase;

  constructor() {
    super();
    this.useCase = CreateTimeslotUseCase.get();
  }

  handle = async (req: CreateTimeslotRequest, reply: FastifyReply): Promise<void> => {
    try {
      const timeslot = req.body;
      const createdTimeslot = await this.useCase.run(timeslot);
      reply.status(this.createdCode).send(createdTimeslot);
    } catch (err) {
      console.error('Error in CreateTimeslotRouteHandler.handle.');
      this.errorHandler(reply, err as ApiError);
    }
  };
}

export default async function CreateTimeslotRoute(app: FastifyInstance) {
  const createTimeslotRouteHandler = new CreateTimeslotRouteHandler();
  const options: FastifyPluginOptions = {
    schema: {
      tags: ['createTimeslot'],
      body: { $ref: `${SCHEMA_NAMES.TIMESLOT}#` },
      response: { 201: { $ref: `${SCHEMA_NAMES.TIMESLOT}#` } },
    },
  };
  app.post(createTimeslotRouteHandler.uri, options, createTimeslotRouteHandler.handle);
  console.info(`Initialization: POST ${createTimeslotRouteHandler.uri} constructed`);
}
