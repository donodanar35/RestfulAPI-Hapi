/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getPlaylistByCollaborator(collaborator) {
    const query = {
      text: 'SELECT playlists.id AS id,  playlists.name AS name, users.username AS username FROM playlists, users, collaborations WHERE collaborations.user_id = users.id AND playlists.id = collaborations.playlist_id AND collaborations.user_id = $1',
      values: [collaborator],
    };
    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getPlaylistsById(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT playlists.id AS id, playlists.name AS name, users.username AS username FROM playlists, users WHERE playlists.owner = users.id AND playlists.id = $1',
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async getPlaylistsByOwner(owner) {
    const query = {
      text: 'SELECT playlists.id AS id, playlists.name AS name, users.username AS username FROM playlists, users WHERE playlists.owner = users.id AND playlists.owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async addPlaylist(name, owner) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`playlist:${id}`);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
