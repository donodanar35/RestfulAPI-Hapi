/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */

class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail, playlistId } = JSON.parse(message.content.toString());
      const isOwner = await this._playlistsService.verifyOwner(userId);
      console.log(`userId: ${userId}, targetEmail:${targetEmail}, playlistId: ${playlistId}`);
      let playlistsongs = [];
      let result;
      if (isOwner > 0) {
        playlistsongs = await this._playlistsService.getPlaylistsongs(playlistId);
        result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistsongs));
        console.log(playlistsongs);
      } else {
        const isCollaborator = await this._playlistsService.verifyCollaborator(userId);
        if (isCollaborator > 0) {
          playlistsongs = await this._playlistsService.getPlaylistsongs(playlistId);
          result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistsongs));
          console.log(playlistsongs);
        }
      }
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
