import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { FastifyReply } from 'fastify';
import { SCHEMA_NAMES } from '../constants';
import type { CreateMeetingRequest, ApiError } from '../types';
import CreateMeetingUseCase from '../useCases/CreateMeetingUseCase';
import BaseRouteHandler from './BaseRouteHandler';

export class CreateMeetingRouteHandler extends BaseRouteHandler {
  public uri: string = '/meetings';

  private useCase: CreateMeetingUseCase;

  constructor() {
    super();
    this.useCase = CreateMeetingUseCase.get();
  }

  handle = async (req: CreateMeetingRequest, reply: FastifyReply): Promise<void> => {
    try {
      const meeting = req.body;
      const createdMeeting = await this.useCase.run(meeting);
      reply.status(this.createdCode).send(createdMeeting);
    } catch (err) {
      console.error('Error in CreateMeetingRouteHandler.handle.');
      this.errorHandler(reply, err as ApiError);
    }
  };
}

export default async function CreateTimeslotRoute(app: FastifyInstance) {
  const createMeetingRouteHandler = new CreateMeetingRouteHandler();
  const options: FastifyPluginOptions = {
    schema: {
      tags: ['createMeeting'],
      body: { $ref: `${SCHEMA_NAMES.MEETING}#` },
      response: { 201: { $ref: `${SCHEMA_NAMES.MEETING}#` } },
    },
  };
  app.post(createMeetingRouteHandler.uri, options, createMeetingRouteHandler.handle);
  console.info(`Initialization: POST ${createMeetingRouteHandler.uri} constructed`);
}
