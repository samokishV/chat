const config = require('config');
const express = require('express');

const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const consumer = require('./consumer.js');
const route = require('./route.js');

consumer.start(io);
route.start(app, io);

const port = config.get('serverConfig.port');
const host = config.get('serverConfig.host');

http.listen(port, host, () => {});
