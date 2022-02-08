const Joi = require('joi');
/* eslint-disable linebreak-style */
const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml').required(),
}).unknown();
module.exports = { ImageHeadersSchema };
