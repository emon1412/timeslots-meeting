import { SCHEMA_NAMES } from '../constants';

export default {
  $id: SCHEMA_NAMES.USER,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    firstName: {
      type: 'string',
      pattern: "^[A-Za-z ,.'-]+$",
      minLength: 1,
    },
    lastName: {
      type: 'string',
      pattern: "^[A-Za-z ,.'-]+$",
      minLength: 1,
    },
    timezone: {
      type: 'string',
      enum: ['ET', 'CT', 'MT', 'PT', 'AK', 'HI'],
    },
  },
  required: ['firstName', 'lastName', 'timezone'],
  additionalProperties: false,
};
