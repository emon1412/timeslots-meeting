import createError from 'http-errors';
import type { Meeting } from '../types';
import { UserService, TimeslotService, MeetingService } from '../services';

export default class CreateMeetingUseCase {
  private meetingService: MeetingService;

  private timeslotService: TimeslotService;

  private userService: UserService;

  static instance: CreateMeetingUseCase;

  constructor() {
    CreateMeetingUseCase.instance = this;
    this.meetingService = MeetingService.get();
    this.timeslotService = TimeslotService.get();
    this.userService = UserService.get();
  }

  static get() {
    return CreateMeetingUseCase.instance || new CreateMeetingUseCase();
  }

  public run = async (meeting: Meeting) => {
    try {
      const {
        start, end, attendeeId, ownerId,
      } = meeting;
      const matchedTimeslots = await this.timeslotService.getTimeslotsByUserIdAndInterval(attendeeId, start, end);

      if (matchedTimeslots.length === 0) {
        throw createError(422, `Cannot create meeting. User id ${attendeeId} does not have any timeslots in the specified interval.`);
      }

      const [attendeeUser, ownerUser] = await Promise.all([
        this.userService.getById(attendeeId),
        this.userService.getById(ownerId),
      ]);

      if (!attendeeUser) {
        throw createError(422, `Cannot create meeting. Attendee with id ${attendeeId} does not exist.`);
      }

      if (!ownerUser) {
        throw createError(422, `Cannot create meeting. Owner with id ${ownerId} does not exist.`);
      }

      return await this.meetingService.createMeeting(meeting);
    } catch (err) {
      console.error('Error in CreateMeetingUseCase.run.');
      throw err;
    }
  };
}
