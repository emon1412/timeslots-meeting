import TimeslotService from '../../../src/services/TimeslotService';
import type { Timeslot } from '../../../src/types';
import { Timeslot as TimeslotModel } from '../../../src/models';

const sqliteAccessorMock = {
  query: jest.fn(),
  run: jest.fn(),
};

jest.mock('../../../src/dataAccessors/SQLiteAccessor', () => ({
  get: jest.fn().mockImplementation(() => sqliteAccessorMock),
}));

describe('TimeslotService', () => {
  it('should be defined', () => {
    expect(TimeslotService).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof TimeslotService).toBe('function');
  });
  it('should return an instance of TimeslotService', () => {
    const service = new TimeslotService();
    expect(service instanceof TimeslotService).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of TimeslotService', () => {
      const service = TimeslotService.get();
      expect(service instanceof TimeslotService).toBe(true);
    });
    it('should return the same instance of TimeslotService', () => {
      const service = TimeslotService.get();
      const service2 = TimeslotService.get();
      expect(service).toEqual(service2);
    });
  });

  describe('createTimeslot', () => {
    const timeslot = {
      start: '2021-09-01T10:30:00.000Z',
      end: '2021-09-01T11:00:00.000Z',
      userId: 'userId1',
      id: '1',
    } as Timeslot;

    let service: TimeslotService;
    beforeEach(() => {
      service = TimeslotService.get();
      service.getById = jest.fn().mockResolvedValue([]);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should call sqliteAccessor.run with the correct parameters', async () => {
      await service.createTimeslot(timeslot);
      expect(sqliteAccessorMock.run).toHaveBeenCalledWith(
        'INSERT INTO Timeslots (id, userId, start, end) VALUES (?, ?, ?, ?)',
        [timeslot.id, timeslot.userId, timeslot.start, timeslot.end]
      );
    });

    it('should return the result of .getById', async () => {
      service.getById = jest.fn().mockResolvedValue(timeslot);
      const result = await service.createTimeslot(timeslot);
      expect(result).toEqual(timeslot);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      service.getById = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      service = TimeslotService.get();
      await expect(service.createTimeslot(timeslot)).rejects
        .toThrow(errorMessage);
    });
  });

  describe('getTimeslotsByUserId', () => {
    const userId = '1';

    let service: TimeslotService;
    beforeEach(() => {
      service = TimeslotService.get();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call sqliteAccessor.query with the correct parameters', async () => {
      await service.getTimeslotsByUserId(userId);
      expect(sqliteAccessorMock.query.mock.calls[0]).toEqual([
        'SELECT * FROM Timeslots WHERE userId = ?',
        [userId],
        TimeslotModel,
      ]);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      sqliteAccessorMock.query = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.getTimeslotsByUserId(userId)).rejects
        .toThrow(errorMessage);
    });
  });

  describe('getTimeslotsByUserIdAndInterval', () => {
    const userId = '1';
    const start = '2021-09-01T10:30:00.000Z';
    const end = '2021-09-01T11:00:00.000Z';

    let service: TimeslotService;
    beforeEach(() => {
      service = TimeslotService.get();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call sqliteAccessor.query with the correct parameters', async () => {
      await service.getTimeslotsByUserIdAndInterval(userId, start, end);
      expect(sqliteAccessorMock.query.mock.calls[0]).toEqual([
        'SELECT * FROM Timeslots WHERE userId = ? AND start <= ? AND end >= ?',
        [userId, start, end],
        TimeslotModel,
      ]);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      sqliteAccessorMock.query = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.getTimeslotsByUserIdAndInterval(userId, start, end)).rejects
        .toThrow(errorMessage);
    });
  });
});
