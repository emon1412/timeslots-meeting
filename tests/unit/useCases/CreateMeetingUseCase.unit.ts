import CreateMeetingUseCase from '../../../src/useCases/CreateMeetingUseCase';
import type { Timeslot, User, Meeting } from '../../../src/types';

const userServiceMock = {
  getById: jest.fn(),
};

const timeslotServiceMock = {
  getTimeslotsByUserIdAndInterval: jest.fn(),
};

const meetingServiceMock = {
  createMeeting: jest.fn(),
};

jest.mock('../../../src/services', () => ({
  UserService: {
    get: jest.fn().mockImplementation(() => userServiceMock),
  },
  TimeslotService: {
    get: jest.fn().mockImplementation(() => timeslotServiceMock),
  },
  MeetingService: {
    get: jest.fn().mockImplementation(() => meetingServiceMock),
  },
}));

describe('CreateMeetingUseCase', () => {
  it('should be defined', () => {
    expect(CreateMeetingUseCase).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof CreateMeetingUseCase).toBe('function');
  });
  it('should return an instance of CreateMeetingUseCase', () => {
    const useCase = new CreateMeetingUseCase();
    expect(useCase instanceof CreateMeetingUseCase).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of CreateMeetingUseCase', () => {
      const useCase = CreateMeetingUseCase.get();
      expect(useCase instanceof CreateMeetingUseCase).toBe(true);
    });
    it('should return the same instance of CreateMeetingUseCase', () => {
      const useCase = CreateMeetingUseCase.get();
      const useCase2 = CreateMeetingUseCase.get();
      expect(useCase).toEqual(useCase2);
    });
  });

  describe('run', () => {
    const user1 = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'CT',
      id: 'userId1',
    } as User;

    const user2 = {
      firstName: 'Ann',
      lastName: 'Perkins',
      timezone: 'CT',
      id: 'userId2',
    } as User;

    const timeslot = {
      id: '060c8721-d013-47bf-aa57-1e73eda8b20c',
      start: '2021-09-01T00:00:00.000Z',
      end: '2021-09-01T12:00:00.000Z',
      userId: user2.id,
    } as Timeslot;

    const meeting = {
      start: '2020-09-01T11:30:00.000Z',
      end: '2020-09-01T12:00:00.000Z',
      ownerId: user1.id,
      attendeeId: user2.id,
    } as Meeting;

    let useCase: CreateMeetingUseCase;
    beforeEach(() => {
      useCase = CreateMeetingUseCase.get();
      timeslotServiceMock.getTimeslotsByUserIdAndInterval = jest.fn().mockResolvedValueOnce(timeslot);
      userServiceMock.getById = jest.fn().mockResolvedValueOnce(user1).mockResolvedValueOnce(user2);
      meetingServiceMock.createMeeting = jest.fn().mockResolvedValueOnce({});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call timeslotServiceMock.createTimeslot with the correct parameters', async () => {
      await useCase.run(meeting);
      expect(meetingServiceMock.createMeeting).toHaveBeenCalledWith(
        meeting
      );
    });

    it('should throw 422 if attendee has no matched timeslots', async () => {
      timeslotServiceMock.getTimeslotsByUserIdAndInterval = jest.fn().mockResolvedValueOnce([]);
      await expect(useCase.run(meeting)).rejects.toThrow(
        `Cannot create meeting. User id ${meeting.attendeeId} does not have any timeslots in the specified interval.`
      );
    });

    it('should throw 422 if attendee does not exist', async () => {
      userServiceMock.getById = jest.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(user2);
      await expect(useCase.run(meeting)).rejects.toThrow(
        `Cannot create meeting. Attendee with id ${meeting.attendeeId} does not exist.`
      );
    });

    it('should throw 422 if meetings owner does not exist', async () => {
      userServiceMock.getById = jest.fn().mockResolvedValueOnce(user1).mockResolvedValueOnce(undefined);
      await expect(useCase.run(meeting)).rejects.toThrow(
        `Cannot create meeting. Owner with id ${meeting.ownerId} does not exist.`
      );
    });
  });
});
