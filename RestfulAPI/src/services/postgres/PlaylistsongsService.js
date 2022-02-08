/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addPlaylistsong(songId, playlistId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    await this._cacheService.delete(`playlistsongs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsongsById(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT songs.id AS id, songs.title AS title, songs.performer AS performer FROM playlistsongs, songs WHERE playlistsongs.song_id = songs.id AND playlistsongs.playlist_id = $1',
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deletePlaylistsongById(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`playlistsongs:${playlistId}`);
    return result.rows.length;
  }
}

module.exports = PlaylistsongsService;
