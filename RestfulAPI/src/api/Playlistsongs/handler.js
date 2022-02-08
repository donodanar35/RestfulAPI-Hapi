/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsongsHandler {
  constructor(service, collaboration, validator) {
    this._collaboration = collaboration;
    this._service = service;
    this._validator = validator;
    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
    this.deletePlaylistsongHandler = this.deletePlaylistsongHandler.bind(this);
  }

  async postPlaylistsongHandler(request, h) {
    try {
      this._validator.validatePlaylistsongPayload(request.payload);
      const { songId } = request.payload;
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const isOwner = await this._collaboration.verifyPlaylistsongOwnerByPlaylistid(playlistId, credentialId);
      if (isOwner === 0) {
        await this._collaboration.verifyCollaboratorByPlaylistid(playlistId, credentialId);
      }
      const result = await this._service.addPlaylistsong(songId, playlistId);
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsongsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const isOwner = await this._collaboration.verifyPlaylistsongOwnerByPlaylistid(playlistId, credentialId);
      if (isOwner === 0) {
        await this._collaboration.verifyCollaboratorByPlaylistid(playlistId, credentialId);
      }
      const songs = await this._service.getPlaylistsongsById(playlistId);
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistsongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const isOwner = await this._collaboration.verifyPlaylistsongOwnerByPlaylistid(playlistId, credentialId);
      if (isOwner === 0) {
        await this._collaboration.verifyCollaboratorByPlaylistid(playlistId, credentialId);
      }
      const result = await this._service.deletePlaylistsongById(songId, playlistId);
      if (result > 0) {
        const response = h.response({
          status: 'success',
          message: 'Lagu berhasil dihapus dari playlist',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Lagu gagal dihapus. Song Id tidak ditemukan',
      });
      response.code(400);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsongsHandler;
