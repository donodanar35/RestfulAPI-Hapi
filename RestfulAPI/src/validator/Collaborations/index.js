/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validateCollaboratonPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
