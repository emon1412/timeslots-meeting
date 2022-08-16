import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { FastifyReply } from 'fastify';
import { SCHEMA_NAMES } from '../constants';
import type { GetTimeslotsRequest, ApiError } from '../types';
import GetTimeslotsUseCase from '../useCases/GetTimeslotsUseCase';
import BaseRouteHandler from './BaseRouteHandler';

export class GetTimeslotsRouteHandler extends BaseRouteHandler {
  public uri: string = '/users/:userId/timeslots';

  private useCase: GetTimeslotsUseCase;

  constructor() {
    super();
    this.useCase = GetTimeslotsUseCase.get();
  }

  handle = async (req: GetTimeslotsRequest, reply: FastifyReply): Promise<void> => {
    try {
      const { userId } = req.params;
      const timeslots = await this.useCase.run(userId);
      reply.status(this.successCode).send(timeslots);
    } catch (err) {
      console.error('Error in GetTimeslotsRouteHandler.handle.');
      this.errorHandler(reply, err as ApiError);
    }
  };
}

export default async function GetTimeslotsRoute(app: FastifyInstance) {
  const getTimeslotsRouteHandler = new GetTimeslotsRouteHandler();
  const options: FastifyPluginOptions = {
    schema: {
      tags: ['getTimeslots'],
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
      response: {
        200: {
          type: 'array',
          items: { $ref: `${SCHEMA_NAMES.TIMESLOT}#` },
        },
      },
    },
  };
  app.get(getTimeslotsRouteHandler.uri, options, getTimeslotsRouteHandler.handle);
  console.info(`Initialization: GET ${getTimeslotsRouteHandler.uri} constructed`);
}
