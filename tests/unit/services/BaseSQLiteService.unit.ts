import { z } from 'zod';
import BaseSQliteService from '../../../src/services/BaseSQLiteService';

const sqliteAccessorMock = {
  query: jest.fn(),
  run: jest.fn(),
};

jest.mock('../../../src/dataAccessors/SQLiteAccessor', () => ({
  get: jest.fn().mockImplementation(() => sqliteAccessorMock),
}));

describe('BaseSQLiteService', () => {
  const model = z.object({});
  it('should be defined', () => {
    expect(BaseSQliteService).toBeDefined();
  });
  it('should be a function', () => {
    expect(typeof BaseSQliteService).toBe('function');
  });

  it('should return an instance of BaseSQliteService', () => {
    const accessor = new BaseSQliteService('Users', model);
    expect(accessor instanceof BaseSQliteService).toBe(true);
  });

  describe('getById', () => {
    let service: BaseSQliteService;
    beforeEach(() => {
      sqliteAccessorMock.query = jest.fn().mockResolvedValue([]);
      service = new BaseSQliteService('Users', model);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call sqliteAccessor.query with the correct parameters', async () => {
      const id = '1';
      await service.getById(id);
      expect(sqliteAccessorMock.query).toHaveBeenCalledWith(
        'SELECT * FROM Users WHERE id = ?',
        [id],
        model
      );
    });

    it('should return the result of sqliteAccessor.query', async () => {
      const row = { id: '1' };
      sqliteAccessorMock.query = jest.fn().mockResolvedValue([row]);
      const result = await service.getById('id');
      expect(result).toEqual(row);
    });

    it('should catch errors', async () => {
      const errorMessage = 'Bruh';
      sqliteAccessorMock.query = jest.fn().mockRejectedValue(new Error(errorMessage));
      await expect(service.getById('id')).rejects.toThrow(errorMessage);
    });
  });
});
