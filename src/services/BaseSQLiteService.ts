import { z } from 'zod';
import { RunResult } from 'sqlite3';
import SQLiteAccessor from '../dataAccessors/SQLiteAccessor';

export default class BaseSQLiteService {
  static instance: BaseSQLiteService;

  protected tableName: string;

  protected model: z.ZodObject<any, any, any, any, any>;

  protected sqliteAccessor: SQLiteAccessor;

  constructor(tableName: string, model: z.ZodObject<any, any, any, any, any>) {
    this.sqliteAccessor = SQLiteAccessor.get();

    this.tableName = tableName;
    this.model = model;
  }

  protected query = async <T = z.infer<typeof this.model>>(sql: string, params: any[]): Promise<T[]> => this.sqliteAccessor.query<T>(sql, params, this.model);

  protected run = async (sql: string, params: any[]): Promise<RunResult> => this.sqliteAccessor.run(sql, params);

  public getById = async <T = z.infer<typeof this.model>>(id: string): Promise<T> => {
    try {
      const [result] = await this.query(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return result;
    } catch (err) {
      console.error(`Error in ${this.tableName}Service.getById. [id: ${id}]`);
      throw err;
    }
  };
}
