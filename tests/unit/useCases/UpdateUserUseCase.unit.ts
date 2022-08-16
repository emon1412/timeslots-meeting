import UpdateUserUseCase from '../../../src/useCases/UpdateUserUseCase';
import type { User } from '../../../src/types';

const userServiceMock = {
  updateUser: jest.fn(),
  getById: jest.fn(),
};

jest.mock('../../../src/services', () => ({
  UserService: {
    get: jest.fn().mockImplementation(() => userServiceMock),
  },
}));

describe('UpdateUserUseCase', () => {
  it('should be defined', () => {
    expect(UpdateUserUseCase).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof UpdateUserUseCase).toBe('function');
  });
  it('should return an instance of UpdateUserUseCase', () => {
    const useCase = new UpdateUserUseCase();
    expect(useCase instanceof UpdateUserUseCase).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of UpdateUserUseCase', () => {
      const useCase = UpdateUserUseCase.get();
      expect(useCase instanceof UpdateUserUseCase).toBe(true);
    });
    it('should return the same instance of UpdateUserUseCase', () => {
      const useCase = UpdateUserUseCase.get();
      const useCase2 = UpdateUserUseCase.get();
      expect(useCase).toEqual(useCase2);
    });
  });

  describe('run', () => {
    const userId = '1';
    const user = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'ET',
    } as User;

    let useCase: UpdateUserUseCase;
    beforeEach(() => {
      useCase = UpdateUserUseCase.get();
      userServiceMock.updateUser = jest.fn().mockResolvedValue({});
      userServiceMock.getById = jest.fn().mockResolvedValue(user);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call userServiceMock.updateUser with the correct parameters', async () => {
      await useCase.run(userId, user);
      expect(userServiceMock.updateUser).toHaveBeenCalledWith(
        userId,
        user
      );
    });

    it('should throw error if the User to be updated cannot be found', async () => {
      userServiceMock.getById = jest.fn().mockResolvedValue(undefined);
      await expect(useCase.run(userId, user)).rejects.toThrowError(
        `User with id ${userId} not found.`
      );
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      userServiceMock.updateUser = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(() => useCase.run(userId, user)).rejects.toThrow(errorMessage);
    });
  });
});
