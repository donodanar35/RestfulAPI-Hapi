/* eslint-disable linebreak-style */
const PlaylistsongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Playlist Song Open Music',
  version: '1.0.0',
  register: async (server, { service, collaboration, validator }) => {
    const mymusicsHandler = new PlaylistsongsHandler(service, collaboration, validator);
    server.route(routes(mymusicsHandler));
  },
};
