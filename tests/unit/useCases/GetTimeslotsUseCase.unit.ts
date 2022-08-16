import GetTimeslotsUseCase from '../../../src/useCases/GetTimeslotsUseCase';
import type { Timeslot } from '../../../src/types';

const timeslotServiceMock = {
  getTimeslotsByUserId: jest.fn(),
};

jest.mock('../../../src/services', () => ({
  TimeslotService: {
    get: jest.fn().mockImplementation(() => timeslotServiceMock),
  },
}));

describe('GetTimeslotsUseCase', () => {
  it('should be defined', () => {
    expect(GetTimeslotsUseCase).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof GetTimeslotsUseCase).toBe('function');
  });
  it('should return an instance of GetTimeslotsUseCase', () => {
    const useCase = new GetTimeslotsUseCase();
    expect(useCase instanceof GetTimeslotsUseCase).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of GetTimeslotsUseCase', () => {
      const useCase = GetTimeslotsUseCase.get();
      expect(useCase instanceof GetTimeslotsUseCase).toBe(true);
    });
    it('should return the same instance of GetTimeslotsUseCase', () => {
      const useCase = GetTimeslotsUseCase.get();
      const useCase2 = GetTimeslotsUseCase.get();
      expect(useCase).toEqual(useCase2);
    });
  });

  describe('run', () => {
    const userId = '1';
    const timeslots = [
      {
        id: '060c8721-d013-47bf-aa57-1e73eda8b20c',
        start: '2021-09-01T00:00:00.000Z',
        end: '2021-09-01T12:00:00.000Z',
        userId,
      },
      {
        id: '060c8721-d013-47bf-aa57-1e73eda8b20c',
        start: '2021-09-02T00:00:00.000Z',
        end: '2021-09-02T12:00:00.000Z',
        userId,
      },
    ] as Timeslot[];

    let useCase: GetTimeslotsUseCase;
    beforeEach(() => {
      useCase = GetTimeslotsUseCase.get();
      timeslotServiceMock.getTimeslotsByUserId = jest.fn().mockResolvedValueOnce(timeslots);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call timeslotServiceMock.createTimeslot with the correct parameters', async () => {
      await useCase.run(userId);
      expect(timeslotServiceMock.getTimeslotsByUserId).toHaveBeenCalledWith(
        userId
      );
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      timeslotServiceMock.getTimeslotsByUserId = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(() => useCase.run(userId)).rejects.toThrow(errorMessage);
    });
  });
});
