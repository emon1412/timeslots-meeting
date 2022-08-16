import MeetingService from '../../../src/services/MeetingService';
import type { Meeting } from '../../../src/types';

const sqliteAccessorMock = {
  query: jest.fn(),
  run: jest.fn(),
};

jest.mock('../../../src/dataAccessors/SQLiteAccessor', () => ({
  get: jest.fn().mockImplementation(() => sqliteAccessorMock),
}));

describe('MeetingService', () => {
  it('should be defined', () => {
    expect(MeetingService).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof MeetingService).toBe('function');
  });
  it('should return an instance of MeetingService', () => {
    const service = new MeetingService();
    expect(service instanceof MeetingService).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of MeetingService', () => {
      const service = MeetingService.get();
      expect(service instanceof MeetingService).toBe(true);
    });
    it('should return the same instance of MeetingService', () => {
      const service = MeetingService.get();
      const service2 = MeetingService.get();
      expect(service).toEqual(service2);
    });
  });

  describe('createMeeting', () => {
    const meeting = {
      start: '2021-09-01T10:30:00.000Z',
      end: '2021-09-01T11:00:00.000Z',
      ownerId: 'bd5e69ff-3c67-431e-abcd-713608f188a9',
      attendeeId: 'dc77c68b-7fc1-440c-be28-a9183b4d8c2a',
      id: '1',
    } as Meeting;

    let service: MeetingService;
    beforeEach(() => {
      service = MeetingService.get();
      service.getById = jest.fn().mockResolvedValue([]);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should call sqliteAccessor.run with the correct parameters', async () => {
      await service.createMeeting(meeting);
      expect(sqliteAccessorMock.run).toHaveBeenCalledWith(
        'INSERT INTO Meetings (id, ownerId, attendeeId, start, end) VALUES (?, ?, ?, ?, ?)',
        [meeting.id, meeting.ownerId, meeting.attendeeId, meeting.start, meeting.end]
      );
    });

    it('should return the result of .getById', async () => {
      service.getById = jest.fn().mockResolvedValue(meeting);
      const result = await service.createMeeting(meeting);
      expect(result).toEqual(meeting);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      service.getById = jest.fn().mockRejectedValue(new Error(errorMessage));
      await expect(service.createMeeting(meeting)).rejects
        .toThrow(errorMessage);
    });
  });
});
