import { TimeslotService } from '../services';

export default class GetTimeslotsUseCase {
  private timeslotService: TimeslotService;

  static instance: GetTimeslotsUseCase;

  constructor() {
    GetTimeslotsUseCase.instance = this;
    this.timeslotService = TimeslotService.get();
  }

  static get() {
    return GetTimeslotsUseCase.instance || new GetTimeslotsUseCase();
  }

  public run = async (userId: string) => {
    try {
      return await this.timeslotService.getTimeslotsByUserId(userId);
    } catch (err) {
      console.error('Error in GetTimeslotsUseCase.run.');
      throw err;
    }
  };
}
