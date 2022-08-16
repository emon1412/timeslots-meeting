import { randomUUID } from 'crypto';
import { Meeting as MeetingModel } from '../models';
import type { Meeting } from '../types';
import BaseSQLiteService from './BaseSQLiteService';

export default class MeetingService extends BaseSQLiteService {
  static instance: MeetingService;

  constructor() {
    super('Meetings', MeetingModel);
    MeetingService.instance = this;

    console.info('MeetingService: constructed.');
  }

  static get() {
    return MeetingService.instance || new MeetingService();
  }

  public createMeeting = async (meeting: Meeting): Promise<Meeting> => {
    try {
      const {
        ownerId, attendeeId, start, end, id,
      } = meeting;
      const uuid = id || randomUUID();
      await this.run(
        `INSERT INTO ${this.tableName} (id, ownerId, attendeeId, start, end) VALUES (?, ?, ?, ?, ?)`,
        [uuid, ownerId, attendeeId, start, end]
      );

      return await this.getById(uuid);
    } catch (err) {
      console.error(`Error in MeetingService.createMeeting. [Meeting: ${JSON.stringify(meeting)}]`);
      throw err;
    }
  };
}
