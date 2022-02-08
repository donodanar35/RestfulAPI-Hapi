/* eslint-disable linebreak-style */
const Joi = require('joi');

const PlaylistsongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistsongPayloadSchema };
