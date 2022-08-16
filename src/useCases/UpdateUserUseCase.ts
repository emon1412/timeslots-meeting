import createError from 'http-errors';
import type { User } from '../types';
import { UserService } from '../services';

export default class UpdateUserUseCase {
  private userService: UserService;

  static instance: UpdateUserUseCase;

  constructor() {
    UpdateUserUseCase.instance = this;
    this.userService = UserService.get();
  }

  static get() {
    return UpdateUserUseCase.instance || new UpdateUserUseCase();
  }

  public run = async (userId: string, user: Omit<User, 'id'>) => {
    try {
      const foundUser = await this.userService.getById(userId);
      if (!foundUser) {
        throw createError(404, `User with id ${userId} not found.`);
      }
      return await this.userService.updateUser(userId, user);
    } catch (err) {
      console.error('Error in UpdateUserUseCase.run.');
      throw err;
    }
  };
}
