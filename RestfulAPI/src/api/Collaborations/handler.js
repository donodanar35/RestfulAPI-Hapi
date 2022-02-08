/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaboratonPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyCollaborationsOwner(playlistId, credentialId);
      const collaborationId = await this._service.addCollaboration(userId, playlistId);
      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
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

  async deleteCollaborationHandler(request, h) {
    try {
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyCollaborationsOwner(playlistId, credentialId);
      const result = await this._service.deleteCollaborationById(userId, playlistId);
      if (result > 0) {
        const response = h.response({
          status: 'success',
          message: 'Kolaborasi berhasil dihapus',
        });
        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Kolaborasi gagal dihapus. Id tidak ditemukan',
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

module.exports = CollaborationsHandler;
