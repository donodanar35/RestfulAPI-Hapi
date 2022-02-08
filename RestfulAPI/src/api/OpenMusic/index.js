/* eslint-disable linebreak-style */
const MusicsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Open Music',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const mymusicsHandler = new MusicsHandler(service, validator);
    server.route(routes(mymusicsHandler));
  },
};
