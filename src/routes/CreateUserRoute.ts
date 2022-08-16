import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { FastifyReply } from 'fastify';
import { SCHEMA_NAMES } from '../constants';
import type { CreateUserRequest, ApiError } from '../types';
import CreateUserUseCase from '../useCases/CreateUserUseCase';
import BaseRouteHandler from './BaseRouteHandler';

export class CreateUserRouteHandler extends BaseRouteHandler {
  public uri: string = '/users';

  private useCase: CreateUserUseCase;

  constructor() {
    super();
    this.useCase = CreateUserUseCase.get();
  }

  handle = async (req: CreateUserRequest, reply: FastifyReply): Promise<void> => {
    try {
      const user = req.body;
      const createdUser = await this.useCase.run(user);
      reply.status(this.createdCode).send(createdUser);
    } catch (err) {
      console.error('Error in CreateUserRouteHandler.handle.');
      this.errorHandler(reply, err as ApiError);
    }
  };
}

export default async function CreateUserRoute(app: FastifyInstance) {
  const createUserRouteHandler = new CreateUserRouteHandler();
  const options: FastifyPluginOptions = {
    schema: {
      tags: ['createUser'],
      body: { $ref: `${SCHEMA_NAMES.USER}#` },
      response: { 201: { $ref: `${SCHEMA_NAMES.USER}#` } },
    },
  };
  app.post(createUserRouteHandler.uri, options, createUserRouteHandler.handle);
  console.info(`Initialization: POST ${createUserRouteHandler.uri} constructed`);
}
