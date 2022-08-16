import SQLite3, { Database, RunResult } from 'sqlite3';
import { z } from 'zod';

export default class SQLiteAccessor {
  static instance: SQLiteAccessor;

  private db: Database;

  constructor() {
    SQLiteAccessor.instance = this;
    this.db = new SQLite3.Database(process.env.DATABASE_FILE || ':memory:');
    console.info('SQLiteAccessor: constructed.');
  }

  static get() {
    return SQLiteAccessor.instance || new SQLiteAccessor();
  }

  async init(): Promise<void> {
    try {
      this.db.run('CREATE TABLE IF NOT EXISTS Users (id TEXT NOT NULL PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, timezone TEXT NOT NULL)');
      this.db.run('CREATE TABLE IF NOT EXISTS Timeslots (id TEXT NOT NULL PRIMARY KEY, start TEXT NOT NULL, end TEXT NOT NULL, userId TEXT NOT NULL)');
      this.db.run('CREATE TABLE IF NOT EXISTS Meetings (id TEXT NOT NULL PRIMARY KEY, start TEXT NOT NULL, end TEXT NOT NULL, ownerId TEXT NOT NULL, attendeeId TEXT NOT NULL)');
      console.info('SQLiteAccessor: initialized.');
    } catch (err) {
      console.error(err);
    }
  }

  public query = <T>(sql: string, params: any[], model: z.ZodObject<any, any, any, any, any>): Promise<T[]> => new Promise((resolve, reject) => {
    try {
      this.db.all(sql, params, (err: Error | null, rows: T[]) => (err ? reject(err) : resolve(rows.map((row) => model.parse(row)))));
    } catch (err) {
      console.error(`Error in SQLiteAccessor.query. [sql: ${sql}, params: ${params}]`);
      throw err;
    }
  });

  public run = (sql: string, params: any[]): Promise<RunResult> => new Promise((resolve, reject) => {
    try {
      this.db.run(sql, params, (result: RunResult, err: Error | null) => (err ? reject(err) : resolve(result)));
    } catch (err) {
      console.error(`Error in SQLiteAccessor.run. [sql: ${sql}] [params: ${params}]`);
      throw err;
    }
  });
}
