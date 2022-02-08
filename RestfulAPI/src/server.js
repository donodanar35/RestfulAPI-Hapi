/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const OpenMusic = require('./api/OpenMusic');
const MusicsService = require('./services/postgres/MusicsService');
const MusicsValidator = require('./validator/OpenMusic');

const playlists = require('./api/Playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/Playlists');

const playlistsongs = require('./api/Playlistsongs');
const PlaylistsongsService = require('./services/postgres/PlaylistsongsService');
const PlaylistsongsValidator = require('./validator/Playlistsongs');

const collaborations = require('./api/Collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/Collaborations');

const users = require('./api/Users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/Users');

const _exports = require('./api/Exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/Exports');

const uploads = require('./api/Uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/Uploads');

const CacheService = require('./services/redis/CacheService');

const authentications = require('./api/Authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/Authentications');

const init = async () => {
  const cacheService = new CacheService();
  const musicsService = new MusicsService(cacheService);
  const usersService = new UsersService();
  const myAuthenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(cacheService);
  const playlistsongsService = new PlaylistsongsService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: OpenMusic,
      options: {
        service: musicsService,
        validator: MusicsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        collaboration: collaborationsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        service: playlistsongsService,
        collaboration: collaborationsService,
        validator: PlaylistsongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        collaboration: collaborationsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: myAuthenticationsService,
        MyUsersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
