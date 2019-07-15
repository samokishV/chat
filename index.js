const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const client = redis.createClient();

const expressHbs = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const config = require('config');
const equalHelper = require('./helpers/equalHelper');
const auth = require('./middleware/auth');
const authController = require('./controllers/authController');
const chatController = require('./controllers/chatController');
const messageController = require('./controllers/messageController');
const validate = require('./requests/validation');

const sessHost = config.get('sessionConfig.host');
const sessPort = config.get('sessionConfig.port');
const sessTtl = config.get('sessionConfig.ttl');
const port = config.get('serverConfig.port');
const host = config.get('serverConfig.host');

require('express-reverse')(app);

app.engine('hbs', expressHbs({
  layoutsDir: 'views/layouts',
  defaultLayout: 'layout',
  extname: 'hbs',
  helpers: {
    equal: equalHelper.equal,
  },
}));

const consumer = require('./consumer.js');
consumer.start(io);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  cookie: {maxAge: 7*24*60*60*1000},
  store: new RedisStore({
    host: sessHost, port: sessPort, client, ttl: sessTtl,
  }),
  resave: false,
  rolling: true,
  saveUninitialized: true,
}));

app.use(cookieParser("secretSign#143_!223"));

app.use(['/chat', '/chat/:id'], auth.isAuthenticated);

app.get('register', '/register', authController.create);

app.post('/register', validate.registration, authController.store);

app.get('login', '/login', authController.login);

app.post('/login', validate.login, authController.auth);

app.get('logout', '/logout', authController.logout);

app.get('/', auth.isAuthenticated, chatController.index);

app.get('chat', '/chat', chatController.index);

app.post(['/', '/chat'], validate.chatStore, chatController.create);

app.delete('/chat/:id', chatController.delete);

app.get('/chat/:id', messageController.index);

app.post('/chat/:id', validate.messageStore, messageController.create);

app.post('/chat-row-template', chatController.getPartial);

app.post('/message-row-template', messageController.getPartial);

http.listen(port, host, () => {});
