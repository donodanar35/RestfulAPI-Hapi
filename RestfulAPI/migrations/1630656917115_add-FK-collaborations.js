exports.up = (pgm) => {
  pgm.addConstraint('collaborations', 'fk_collaborations_playlists', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations_users', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_collaborations_playlists');
  pgm.dropConstraint('collaborations', 'fk_collaborations_users');
};
