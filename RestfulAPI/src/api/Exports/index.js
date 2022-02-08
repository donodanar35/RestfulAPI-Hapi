/* eslint-disable linebreak-style */
const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, collaboration, validator }) => {
    const exportsHandler = new ExportsHandler(service, collaboration, validator);
    server.route(routes(exportsHandler));
  },
};
