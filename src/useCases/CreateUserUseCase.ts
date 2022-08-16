import type { User } from '../types';
import { UserService } from '../services';

export default class CreateUserUseCase {
  private userService: UserService;

  static instance: CreateUserUseCase;

  constructor() {
    CreateUserUseCase.instance = this;
    this.userService = UserService.get();
  }

  static get() {
    return CreateUserUseCase.instance || new CreateUserUseCase();
  }

  public run = async (user: User) => {
    try {
      return await this.userService.createUser(user);
    } catch (err) {
      console.error('Error in CreateUserUseCase.run.');
      throw err;
    }
  };
}
