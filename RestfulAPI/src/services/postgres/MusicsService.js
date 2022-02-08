/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class MusicsService {
  constructor(cacheService) {
    this._cacheService = cacheService;
    this._pool = new Pool();
  }

  async addMusic({
    title, year, performer, genre, duration,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    await this._cacheService.delete('songs');
    return result.rows[0].id;
  }

  async getMusics() {
    try {
      const result = await this._cacheService.get('songs');
      return JSON.parse(result.rows.map(mapDBToModel));
    } catch (error) {
      const result = await this._pool.query('SELECT id, title, performer FROM songs');
      await this._cacheService.set('songs', JSON.stringify(result.rows.map(mapDBToModel)));
      return result.rows.map(mapDBToModel);
    }
  }

  async getMusicById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async editMusicById(id, {
    title, year, performer, genre, duration,
  }) {
    const updatedTime = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre= $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedTime, id],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete('songs');
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteMusicById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete('songs');
    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MusicsService;
