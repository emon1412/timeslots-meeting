import { randomUUID } from 'crypto';
import { User as UserModel } from '../models';
import type { User } from '../types';
import BaseSQLiteService from './BaseSQLiteService';

export default class UserService extends BaseSQLiteService {
  static instance: UserService;

  constructor() {
    super('Users', UserModel);
    UserService.instance = this;

    console.info('UserService: constructed.');
  }

  static get() {
    return UserService.instance || new UserService();
  }

  public createUser = async (user: User): Promise<User> => {
    try {
      const {
        firstName, lastName, timezone, id,
      } = user;
      const uuid = id || randomUUID();
      await this.run(
        `INSERT INTO ${this.tableName} (id, firstName, lastName, timezone) VALUES (?, ?, ?, ?)`,
        [uuid, firstName, lastName, timezone]
      );

      return await this.getById(uuid);
    } catch (err) {
      console.error(`Error in UserService.createUser. [User: ${JSON.stringify(user)}]`);
      throw err;
    }
  };

  public updateUser = async (userId: string, user: Omit<User, 'id'>): Promise<User> => {
    try {
      const {
        firstName, lastName, timezone,
      } = user;
      const setClause = [firstName && 'firstName = ?', lastName && 'lastName = ?', timezone && 'timezone = ?'].filter((item) => !!item).join(', ');
      await this.run(
        `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
        [
          ...[firstName || [], lastName || [], timezone || []].flat(),
          userId,
        ]
      );

      return await this.getById(userId);
    } catch (err) {
      console.error(`Error in UserService.updateUser. [User: ${JSON.stringify(user)}]`);
      throw err;
    }
  };
}
