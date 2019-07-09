const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const redis = require("redis");
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
const expressHbs = require("express-handlebars");
const equalHelper = require('./helpers/equalHelper');
const userController = require("./controllers/userController");
const chatController = require("./controllers/chatController");
const messageController = require("./controllers/messageController");
const validate = require("./requests/validation");
const auth = require('./middleware/auth');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const config = require('config');
const sessHost = config.get('sessionConfig.host');
const sessPort = config.get('sessionConfig.port');
const sessTtl = config.get('sessionConfig.ttl');

const port = config.get('serverConfig.port');
const host = config.get('serverConfig.host');

require('express-reverse')(app);

app.engine("hbs", expressHbs({
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        helpers: {
            equal: equalHelper.equal
        }
    }
));

io.on('connection', function (socket) {
    socket.on('room', function(data) {
        socket.join(data.room);
    });

    socket.on('chatCreate', function (data) {
        io.emit('chatAdd', data);
    });

    socket.on('chatRemove', function (data) {
        io.emit('chatDelete', data)
    });

    socket.on('messageCreate', function (data) {
        io.emit('messageAddGlobal', data);
        io.to(data.room).emit('messageAdd', data);
    });
});

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'keyboard cat',
    cookie: {},
    store: new redisStore({ host: sessHost, port: sessPort, client: client, ttl: sessTtl}),
    resave: false,
    saveUninitialized: true
}));

app.use(['/chat', '/chat/:id'], auth.isAuthenticated);

app.get('register', '/register', userController.create);

app.post('/register', validate.registration, userController.store);

app.get("login", "/login", userController.login);

app.post("/login", validate.login, userController.auth);

app.get("/", auth.isAuthenticated, chatController.index);

app.get("chat", "/chat", chatController.index);

app.post("/chat", validate.chatStore, chatController.create);

app.delete("/chat/:id", chatController.delete);

app.get('/chat/:id', messageController.index);

app.post('/chat/:id', validate.messageStore, messageController.create);

app.post("/chat-row-template", chatController.getPartial);

app.post("/message-row-template", messageController.getPartial);

process.on('uncaughtException', function (err) {
    console.log(err);
});

http.listen(port, host, function(){
    console.log('listening on *:3000');
});