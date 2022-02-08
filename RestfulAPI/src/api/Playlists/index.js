/* eslint-disable linebreak-style */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Playlist Open Music',
  version: '1.0.0',
  register: async (server, { service, collaboration, validator }) => {
    const mymusicsHandler = new PlaylistsHandler(service, collaboration, validator);
    server.route(routes(mymusicsHandler));
  },
};
