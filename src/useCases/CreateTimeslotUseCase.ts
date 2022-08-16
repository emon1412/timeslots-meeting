import createError from 'http-errors';
import type { Timeslot } from '../types';
import { UserService, TimeslotService } from '../services';

export default class CreateTimeslotUseCase {
  private timeslotService: TimeslotService;

  private userService: UserService;

  static instance: CreateTimeslotUseCase;

  constructor() {
    CreateTimeslotUseCase.instance = this;
    this.timeslotService = TimeslotService.get();
    this.userService = UserService.get();
  }

  static get() {
    return CreateTimeslotUseCase.instance || new CreateTimeslotUseCase();
  }

  public run = async (timeslot: Timeslot) => {
    try {
      const user = await this.userService.getById(timeslot.userId);
      if (!user) {
        throw createError(422, `Cannot create timeslot. User with id ${timeslot.userId} does not exist.`);
      }
      return await this.timeslotService.createTimeslot(timeslot);
    } catch (err) {
      console.error('Error in CreateTimeslotUseCase.run.');
      throw err;
    }
  };
}
