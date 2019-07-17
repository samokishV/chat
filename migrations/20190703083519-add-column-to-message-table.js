/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  const dbm = options.dbmigrate;
  const type = dbm.dataType;
  const seed = seedLink;
};

exports.up = function (db) {
  return db.addColumn('messages', 'chatId', {
    type: 'int',
    foreignKey: {
      name: 'messages_chat_id_fk',
      table: 'chats',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      mapping: 'id',
    },
  });
};

exports.down = function (db) {
  return db.removeColumn('messages', 'chatId');
};

exports._meta = {
  version: 1,
};
