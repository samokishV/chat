

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('messages', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    message: 'text',
    user_id: {
      type: 'int',
      foreignKey: {
        name: 'message_user_id_fk',
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
  return db.dropTable('messages');
};

exports._meta = {
  version: 1,
};
