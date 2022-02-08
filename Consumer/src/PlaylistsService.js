/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyCollaborator(collaborator) {
    const query = {
      text: 'SELECT id, playlist_id, user_id FROM collaborations WHERE user_id = $1',
      values: [collaborator],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }

  async verifyOwner(owner) {
    const query = {
      text: 'SELECT id, name, owner FROM playlists WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.length;
  }

  async getPlaylistsongs(playlistId) {
    const query = {
      text: 'SELECT songs.id AS id, songs.title AS title, songs.performer AS performer FROM playlistsongs, songs WHERE playlistsongs.song_id = songs.id AND playlistsongs.playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
