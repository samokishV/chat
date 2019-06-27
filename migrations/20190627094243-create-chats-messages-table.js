'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('chats_messages', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    chat_id: {
      type:'int',
      foreignKey: {
        name: 'chats_messages_chat_id_fk',
        table: 'chats',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    message_id: {
      type:'int',
      foreignKey: {
        name: 'chats_messages_message_id_fk',
        table: 'messages',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        mapping: 'id'
      }
    },
    createdAt: 'datetime',
    updatedAt: 'datetime'
  });
};

exports.down = function(db) {
  return db.dropTable('chats_messages');
};

exports._meta = {
  "version": 1
};
