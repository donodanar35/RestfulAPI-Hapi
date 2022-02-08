/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, collaboration, validator) {
    this._collaboration = collaboration;
    this._service = service;
    this._validator = validator;
    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportNotesPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const isOwner = await this._collaboration.verifyOwner(credentialId);
      let authorization = 0;
      if (isOwner > 0) {
        authorization = 1;
      } else {
        const isCollaborator = await this._collaboration.verifyCollaborator(credentialId);
        if (isCollaborator > 0) {
          authorization = 1;
        }
      }
      if (authorization > 0) {
        const message = {
          userId: request.auth.credentials.id,
          targetEmail: request.payload.targetEmail,
          playlistId,
        };
        await this._service.sendMessage('export:playlists', JSON.stringify(message));
      }
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
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
}

module.exports = ExportsHandler;
