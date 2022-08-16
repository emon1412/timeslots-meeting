/* eslint-disable no-promise-executor-return */
import { z } from 'zod';
import SQLiteAccessor from '../../../src/dataAccessors/SQLiteAccessor';

const sqliteMock = {
  run: jest.fn(),
  query: jest.fn(),
  all: jest.fn(),
};
jest.mock('sqlite3', () => ({
  Database: jest.fn().mockImplementation(() => sqliteMock),
}));

process.env.DATABASE_FILE = 'database.sqlite3';
describe('SQLiteAccessor', () => {
  it('should be defined', () => {
    expect(SQLiteAccessor).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof SQLiteAccessor).toBe('function');
  });

  it('should return an instance of SQLiteAccessor', () => {
    const accessor = new SQLiteAccessor();
    expect(accessor instanceof SQLiteAccessor).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of SQLiteAccessor', () => {
      const accessor = SQLiteAccessor.get();
      expect(accessor instanceof SQLiteAccessor).toBe(true);
    });
    it('should return the same instance of SQLiteAccessor', () => {
      const accessor = SQLiteAccessor.get();
      const accessor2 = SQLiteAccessor.get();
      expect(accessor).toEqual(accessor2);
    });
  });

  describe('init', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should initialize the database', async () => {
      const accessor = new SQLiteAccessor();
      await accessor.init();
    });

    it('should create the Users table if it does not exist', async () => {
      const accessor = new SQLiteAccessor();
      await accessor.init();
      expect(sqliteMock.run).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS Users (id TEXT NOT NULL PRIMARY KEY, firstName TEXT NOT NULL, lastName TEXT NOT NULL, timezone TEXT NOT NULL)'
      );
    });

    it('should create the Timeslots table if it does not exist', async () => {
      const accessor = new SQLiteAccessor();
      await accessor.init();
      expect(sqliteMock.run).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS Timeslots (id TEXT NOT NULL PRIMARY KEY, start TEXT NOT NULL, end TEXT NOT NULL, userId TEXT NOT NULL)'
      );
    });

    it('should create the Meetings table if it does not exist', async () => {
      const accessor = new SQLiteAccessor();
      await accessor.init();
      expect(sqliteMock.run).toHaveBeenCalledWith(
        'CREATE TABLE IF NOT EXISTS Meetings (id TEXT NOT NULL PRIMARY KEY, start TEXT NOT NULL, end TEXT NOT NULL, ownerId TEXT NOT NULL, attendeeId TEXT NOT NULL)'
      );
    });

    describe('query', () => {
      let accessor: SQLiteAccessor;
      beforeEach(() => {
        sqliteMock.all = jest.fn().mockResolvedValue([]);

        accessor = new SQLiteAccessor();
        accessor.init();
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call query with the correct parameters', () => {
        const params = ['someParam'];
        accessor.query('SELECT * FROM Users', params, z.object({}));
        expect(sqliteMock.all.mock.calls[0][0]).toEqual('SELECT * FROM Users');
        expect(sqliteMock.all.mock.calls[0][1]).toEqual(params);
      });

      it('should return result resolved from sqlite.all', () => {
        const rows = [{ id: '1' }];
        sqliteMock.all = jest.fn().mockResolvedValue(rows);
        const result = accessor.query('SELECT * FROM Users', [], z.object({}));
        expect(result).resolves.toEqual(rows);
      });

      it('should throw error if sqlite.all rejects', async () => {
        const errorMessage = 'Bruh';
        sqliteMock.all = jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        });
        await expect(() => accessor.query('SELECT * FROM Users', [], z.object({}))).rejects.toThrow(errorMessage);
      });
    });

    describe('run', () => {
      let accessor: SQLiteAccessor;
      beforeEach(() => {
        accessor = new SQLiteAccessor();
        accessor.init();
      });
      it('should call run with the correct parameters', () => {
        const params = ['someParam'];
        accessor.run('INSERT INTO Users (id) VALUES (1)', params);

        // skip the first 3 sqliteMock.run calls because they are from the init calls
        expect(sqliteMock.run.mock.calls[3][0]).toEqual('INSERT INTO Users (id) VALUES (1)');
        expect(sqliteMock.run.mock.calls[3][1]).toEqual(params);
      });

      it('should throw error if sqlite.run rejects', async () => {
        const errorMessage = 'Bruh';
        sqliteMock.run = jest.fn().mockImplementation(() => {
          throw new Error(errorMessage);
        });
        await expect(() => accessor.run('INSERT INTO Users (id) VALUES (1)', [])).rejects.toThrow(errorMessage);
      });
    });
  });
});
