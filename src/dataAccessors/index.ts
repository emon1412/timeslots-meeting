/* eslint-disable no-await-in-loop */
import fp from 'fastify-plugin';
import SQLiteAccessor from './SQLiteAccessor';

const sqliteAccessor = new SQLiteAccessor();

const DataAccessors = [
  sqliteAccessor,
];

export {
  sqliteAccessor
};

export default fp(async () => {
  for (const dataAccessor of DataAccessors) {
    await dataAccessor.init();
  }
});
