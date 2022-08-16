import { SCHEMA_NAMES } from '../constants';

export default {
  $id: SCHEMA_NAMES.MEETING,
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
    ownerId: {
      type: 'string',
      format: 'uuid',
    },
    attendeeId: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['start', 'end', 'ownerId', 'attendeeId'],
  additionalProperties: false,
};
