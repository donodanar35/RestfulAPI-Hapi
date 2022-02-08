exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
