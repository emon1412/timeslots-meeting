import { randomUUID } from 'crypto';
import { Timeslot as TimeslotModel } from '../models';
import type { Timeslot } from '../types';
import BaseSQLiteService from './BaseSQLiteService';

export default class TimeslotService extends BaseSQLiteService {
  static instance: TimeslotService;

  constructor() {
    super('Timeslots', TimeslotModel);
    TimeslotService.instance = this;

    console.info('TimeslotService: constructed.');
  }

  static get() {
    return TimeslotService.instance || new TimeslotService();
  }

  public createTimeslot = async (timeslot: Timeslot): Promise<Timeslot> => {
    try {
      const {
        userId, start, end, id,
      } = timeslot;
      const uuid = id || randomUUID();
      await this.run(
        `INSERT INTO ${this.tableName} (id, userId, start, end) VALUES (?, ?, ?, ?)`,
        [uuid, userId, start, end]
      );

      return await this.getById(uuid);
    } catch (err) {
      console.error(`Error in TimeslotService.createTimeslot. [Timeslot: ${JSON.stringify(timeslot)}]`);
      throw err;
    }
  };

  public getTimeslotsByUserId = async (userId: string): Promise<Timeslot[]> => {
    try {
      return await this.query(
        `SELECT * FROM ${this.tableName} WHERE userId = ?`,
        [userId]
      );
    } catch (err) {
      console.error(`Error in TimeslotService.getTimeslotsByUserId. [userId: ${userId}]`);
      throw err;
    }
  };

  public getTimeslotsByUserIdAndInterval = async (userId: string, start: string, end: string): Promise<Timeslot[]> => {
    try {
      return await this.query(
        `SELECT * FROM ${this.tableName} WHERE userId = ? AND start <= ? AND end >= ?`,
        [userId, start, end]
      );
    } catch (err) {
      console.error(`Error in TimeslotService.getTimeslotsByUserIdAndInterval. [userId: ${userId}, start: ${start}, end: ${end}]`);
      throw err;
    }
  };
}
