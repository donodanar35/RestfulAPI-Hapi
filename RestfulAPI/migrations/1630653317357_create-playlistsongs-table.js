exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};
