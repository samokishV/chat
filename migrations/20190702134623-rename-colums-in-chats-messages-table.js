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
  return db.renameColumn('chats_messages', 'message_id', 'messageId');
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
