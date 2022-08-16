import CreateUserUseCase from '../../../src/useCases/CreateUserUseCase';
import type { User } from '../../../src/types';

const userServiceMock = {
  createUser: jest.fn(),
};

jest.mock('../../../src/services', () => ({
  UserService: {
    get: jest.fn().mockImplementation(() => userServiceMock),
  },
}));

describe('CreateUserUseCase', () => {
  it('should be defined', () => {
    expect(CreateUserUseCase).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof CreateUserUseCase).toBe('function');
  });
  it('should return an instance of CreateUserUseCase', () => {
    const useCase = new CreateUserUseCase();
    expect(useCase instanceof CreateUserUseCase).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of CreateUserUseCase', () => {
      const useCase = CreateUserUseCase.get();
      expect(useCase instanceof CreateUserUseCase).toBe(true);
    });
    it('should return the same instance of CreateUserUseCase', () => {
      const useCase = CreateUserUseCase.get();
      const useCase2 = CreateUserUseCase.get();
      expect(useCase).toEqual(useCase2);
    });
  });

  describe('run', () => {
    const user = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'ET',
      id: '1',
    } as User;

    let useCase: CreateUserUseCase;
    beforeEach(() => {
      useCase = CreateUserUseCase.get();
      userServiceMock.createUser = jest.fn().mockResolvedValue({});
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call userServiceMock.createUser with the correct parameters', async () => {
      await useCase.run(user);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(
        user
      );
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      userServiceMock.createUser = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      await expect(() => useCase.run(user)).rejects.toThrow(errorMessage);
    });
  });
});
