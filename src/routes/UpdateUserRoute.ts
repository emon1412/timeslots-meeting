import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { FastifyReply } from 'fastify';
import { SCHEMA_NAMES } from '../constants';
import type { UpdateUserRequest, ApiError } from '../types';
import UpdateUserUseCase from '../useCases/UpdateUserUseCase';
import BaseRouteHandler from './BaseRouteHandler';
import userSchema from '../schemas/user';

export class UpdateUserRouteHandler extends BaseRouteHandler {
  public uri: string = '/users/:userId';

  private useCase: UpdateUserUseCase;

  constructor() {
    super();
    this.useCase = UpdateUserUseCase.get();
  }

  handle = async (req: UpdateUserRequest, reply: FastifyReply): Promise<void> => {
    try {
      const user = req.body;
      const { userId } = req.params;
      const updatedUser = await this.useCase.run(userId, user);
      reply.status(this.successCode).send(updatedUser);
    } catch (err) {
      console.error('Error in UpdateUserRouteHandler.handle.');
      this.errorHandler(reply, err as ApiError);
    }
  };
}

export default async function UpdateUserRoute(app: FastifyInstance) {
  const updateUserRouteHandler = new UpdateUserRouteHandler();
  const options: FastifyPluginOptions = {
    schema: {
      tags: ['updateUser'],
      body: {
        type: 'object',
        properties: {
          firstName: {
            ...userSchema.properties.firstName,
          },
          lastName: {
            ...userSchema.properties.lastName,
          },
          timezone: {
            ...userSchema.properties.timezone,
          },
        },
        required: [],
        anyOf: [
          {
            required: ['firstName'],
          },
          {
            required: ['lastName'],
          },
          {
            required: ['timezone'],
          },
        ],
      },
      response: {
        200: {
          $ref: `${SCHEMA_NAMES.USER}#`,
        },
      },
    },
  };
  app.put(updateUserRouteHandler.uri, options, updateUserRouteHandler.handle);
  console.info(`Initialization: PUT ${updateUserRouteHandler.uri} constructed`);
}
