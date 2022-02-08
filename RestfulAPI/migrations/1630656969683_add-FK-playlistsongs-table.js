exports.up = (pgm) => {
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs_playlists', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs_songs', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs_playlists');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs_songs');
};
