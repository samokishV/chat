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
  return db.createTable('chats', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    title: 'string',
    message_number: 'int',
    user_id: {
      type: 'int',
      foreignKey: {
        name: 'chats_user_id_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        mapping: 'id',
      },
    },
    createdAt: 'datetime',
    updatedAt: 'datetime',
  });
};

exports.down = function (db) {
  return db.dropTable('chats');
};

exports._meta = {
  version: 1,
};
