/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistsongOwnerByPlaylistid(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    let isOwner = 0;
    if (playlist.owner === owner) {
      isOwner = 1;
    }
    return isOwner;
  }

  async verifyCollaboratorByPlaylistid(playlistId, collaborator) {
    const query = {
      text: 'SELECT id, playlist_id, user_id FROM collaborations WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
    if (result.rows[0].user_id !== collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyOwner(owner) {
    const query = {
      text: 'SELECT id, name, owner FROM playlists WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }

  async verifyCollaborator(collaborator) {
    const query = {
      text: 'SELECT id, playlist_id, user_id FROM collaborations WHERE user_id = $1',
      values: [collaborator],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
    if (result.rows[0].user_id !== collaborator) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
    return result.rows.length;
  }

  async verifyCollaborationsOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addCollaboration(userId, playlistId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Collaboration gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteCollaborationById(userId, playlistId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE user_id = $1 AND playlist_id = $2 RETURNING id',
      values: [userId, playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }

  async verifyCollaboration(collaborator) {
    const query = {
      text: 'SELECT id, playlist_id, user_id FROM collaborations WHERE user_id = $1',
      values: [collaborator],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }
}

module.exports = CollaborationsService;
