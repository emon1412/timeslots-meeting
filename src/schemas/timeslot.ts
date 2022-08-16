import { SCHEMA_NAMES } from '../constants';

export default {
  $id: SCHEMA_NAMES.TIMESLOT,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    start: {
      $ref: `${SCHEMA_NAMES.DATE_TIME}#`,
    },
    end: {
      $ref: `${SCHEMA_NAMES.DATE_TIME}#`,
    },
    userId: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['start', 'end', 'userId'],
  additionalProperties: false,
};
