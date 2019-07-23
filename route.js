const express = require('express');
const expressHbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController');
const chatController = require('./controllers/chatController');
const messageController = require('./controllers/messageController');
const validate = require('./requests/validation');
const auth = require('./middleware/auth');
const equalHelper = require('./helpers/equalHelper');

module.exports = {
  start(app, io) {
    require('express-reverse')(app);

    app.engine('hbs', expressHbs({
      layoutsDir: 'views/layouts',
      defaultLayout: 'layout',
      extname: 'hbs',
      helpers: {
        equal: equalHelper.equal,
      },
    }));

    app.use(express.static('public'));

    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(cookieParser('secretSign#143_!223'));

    app.use(['/chat', '/chat/:id'], auth.isAuthenticated);

    app.get('register', '/register', authController.showRegisterForm);

    app.post('/register', validate.registration, authController.register);

    app.get('login', '/login', authController.showLoginForm);

    app.post('/login', validate.login, authController.login);

    app.get('logout', '/logout', authController.logout);

    app.get('/', auth.isAuthenticated, chatController.index);

    app.get('chat', '/chat', chatController.index);

    app.post(['/', '/chat'], validate.chatStore, (req, res) => chatController.create(req, res, io));

    app.delete('/chat/:id', (req, res) => chatController.delete(req, res, io));

    app.get('/chat/:id', messageController.index);

    app.post('/chat/:id', validate.messageStore, (req, res) => messageController.create(req, res, io));
  },
};
