import UserService from '../../../src/services/UserService';
import type { User } from '../../../src/types';

const sqliteAccessorMock = {
  query: jest.fn(),
  run: jest.fn(),
};

jest.mock('../../../src/dataAccessors/SQLiteAccessor', () => ({
  get: jest.fn().mockImplementation(() => sqliteAccessorMock),
}));

describe('UserService', () => {
  it('should be defined', () => {
    expect(UserService).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof UserService).toBe('function');
  });
  it('should return an instance of UserService', () => {
    const service = new UserService();
    expect(service instanceof UserService).toBe(true);
  });

  describe('get', () => {
    it('should return an instance of UserService', () => {
      const service = UserService.get();
      expect(service instanceof UserService).toBe(true);
    });
    it('should return the same instance of UserService', () => {
      const service = UserService.get();
      const service2 = UserService.get();
      expect(service).toEqual(service2);
    });
  });

  describe('createUser', () => {
    const user = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'ET',
      id: '1',
    } as User;

    let service: UserService;
    beforeEach(() => {
      service = UserService.get();
      service.getById = jest.fn().mockResolvedValue([]);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should call sqliteAccessor.run with the correct parameters', async () => {
      await service.createUser(user);
      expect(sqliteAccessorMock.run).toHaveBeenCalledWith(
        'INSERT INTO Users (id, firstName, lastName, timezone) VALUES (?, ?, ?, ?)',
        [user.id, user.firstName, user.lastName, user.timezone]
      );
    });

    it('should return the result of .getById', async () => {
      service.getById = jest.fn().mockResolvedValue(user);
      const result = await service.createUser(user);
      expect(result).toEqual(user);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      service.getById = jest.fn().mockRejectedValue(new Error(errorMessage));
      await expect(service.createUser(user)).rejects
        .toThrow(errorMessage);
    });
  });

  describe('updateUser', () => {
    const userId = '1';
    const user = {
      firstName: 'Leslie',
      lastName: 'Knope',
      timezone: 'ET',
    } as User;

    let service: UserService;
    beforeEach(() => {
      service = UserService.get();
      service.getById = jest.fn().mockResolvedValue(user);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call sqliteAccessor.run with the correct parameters', async () => {
      await service.updateUser(userId, user);
      expect(sqliteAccessorMock.run).toHaveBeenCalledWith(
        'UPDATE Users SET firstName = ?, lastName = ?, timezone = ? WHERE id = ?',
        [user.firstName, user.lastName, user.timezone, userId]
      );
    });

    it('should call sqliteAccessor.run with the parameters when given partial User', async () => {
      await service.updateUser(userId, { firstName: 'Leslie' } as User);
      expect(sqliteAccessorMock.run).toHaveBeenCalledWith(
        'UPDATE Users SET firstName = ? WHERE id = ?',
        ['Leslie', userId]
      );
    });

    it('should return the result of .getById', async () => {
      service.getById = jest.fn().mockResolvedValue(user);
      const result = await service.updateUser(userId, user);
      expect(result).toEqual(user);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      service.getById = jest.fn().mockRejectedValue(new Error(errorMessage));
      await expect(service.updateUser(userId, user)).rejects
        .toThrow(errorMessage);
    });
  });
});
