import CreateTimeslotUseCase from '../../../src/useCases/CreateTimeslotUseCase';
import type { Timeslot, User } from '../../../src/types';

const userServiceMock = {
  getById: jest.fn(),
};

const timeslotServiceMock = {
  createTimeslot: jest.fn(),
};

jest.mock('../../../src/services', () => ({
  UserService: {
    get: jest.fn().mockImplementation(() => userServiceMock),
  },
  TimeslotService: {
    get: jest.fn().mockImplementation(() => timeslotServiceMock),
  },
}));

describe('CreateTimeslotUseCase', () => {
  it('should be defined', () => {
    expect(CreateTimeslotUseCase).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof CreateTimeslotUseCase).toBe('function');
  });
  it('should return an instance of CreateTimeslotUseCase', () => {
    const useCase = new CreateTimeslotUseCase();
    expect(useCase instanceof CreateTimeslotUseCase).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of CreateTimeslotUseCase', () => {
      const useCase = CreateTimeslotUseCase.get();
      expect(useCase instanceof CreateTimeslotUseCase).toBe(true);
    });
    it('should return the same instance of CreateTimeslotUseCase', () => {
      const useCase = CreateTimeslotUseCase.get();
      const useCase2 = CreateTimeslotUseCase.get();
      expect(useCase).toEqual(useCase2);
    });
  });

  describe('run', () => {
    const user = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'ET',
    } as User;

    const timeslot = {
      id: '060c8721-d013-47bf-aa57-1e73eda8b20c',
      start: '2021-09-01T00:00:00.000Z',
      end: '2021-09-01T12:00:00.000Z',
      userId: 'dc77c68b-7fc1-440c-be28-a9183b4d8c2a',
    } as Timeslot;

    let useCase: CreateTimeslotUseCase;
    beforeEach(() => {
      useCase = CreateTimeslotUseCase.get();
      timeslotServiceMock.createTimeslot = jest.fn().mockResolvedValue(timeslot);
      userServiceMock.getById = jest.fn().mockResolvedValue(user);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call timeslotServiceMock.createTimeslot with the correct parameters', async () => {
      await useCase.run(timeslot);
      expect(timeslotServiceMock.createTimeslot).toHaveBeenCalledWith(
        timeslot
      );
    });

    it('should throw the User the Timeslot is created for cannot be found', () => {
      userServiceMock.getById = jest.fn().mockResolvedValue(undefined);
      expect(useCase.run(timeslot)).rejects.toThrowError(
        `Cannot create timeslot. User with id ${timeslot.userId} does not exist.`
      );
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      timeslotServiceMock.createTimeslot = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(() => useCase.run(timeslot)).rejects.toThrow(errorMessage);
    });
  });
});
