/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt,
  updatedAt: updated_at,
});

module.exports = { mapDBToModel };
