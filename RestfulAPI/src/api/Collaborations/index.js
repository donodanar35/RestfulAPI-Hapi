/* eslint-disable linebreak-style */
const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Collaboration Song Open Music',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const mymusicsHandler = new CollaborationsHandler(service, validator);
    server.route(routes(mymusicsHandler));
  },
};
