/* eslint-disable linebreak-style */
const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authenticationsService,
    MyUsersService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      MyUsersService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
