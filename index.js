const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require("redis");
const redisStore = require('connect-redis')(session);
const client = redis.createClient();
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');

const Sequelize = require("sequelize");
const User = require("./user.js");
const Chat = require("./chat.js");
const Message = require("./message.js");

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Emitter = require("events");
let emitter = new Emitter();

io.on('connection', function (socket) {
    console.log('connected');

    socket.on('chatCreate', function(data){
        emitter.emit('chatAdd', {});
    });
});


app.use(cookieParser());
// Use the session middleware
app.use(session({
    secret: 'keyboard cat',
    cookie: {},
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
    resave: false,
    saveUninitialized: true
}));

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

// Handlebars Helper equal
const equalHelper = function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
};

app.engine("hbs", expressHbs({
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        helpers: {
            equal: equalHelper
        }
    }
));

app.get(["/", "/chat"], async function(request, response){

    let chats = await Chat.getFullInfo();

    let userId = request.session.user_id;
    let user = await User.findById(userId);

    response.render("chat.hbs", {
        title: "Chats",
        chats: chats,
        user: user,
    });
});

app.post(["/", "/chat"], urlencodedParser, [
    check('title')
        .trim()
        .escape()
        .not().isEmpty()
    ],
    function(request, response) {
        let title = request.body.title;

        let userId = request.session.user_id;
        const errors = validationResult(request);

        if (errors.isEmpty()) {
            return Chat.create({
                title: title,
                userId: userId
            }).then(data => {
                return data.id;
                }
            )
        }
});

app.get('/chat/:id', async function(request, response) {
    let chatId = request.params["id"];

    let chat = await Chat.findOne({where: {id: chatId}});
    let pageTitle = chat.title;

    response.render("chatPage.hbs", {
        title: pageTitle
    });
});

app.post('/chat/:id', urlencodedParser, function(request, response) {
    let chatId = request.params["id"];
    let userId = request.session.user_id;
    let message = request.body.message;

    const errors = validationResult(request);

    if (errors.isEmpty()) {
        Message.create({
            chatId: chatId,
            message: message,
            userId: userId
        }).then(
            result => response.redirect("/chat/" + chatId)
        );
    }
});

app.get("/login", function(request, response){
    response.render("login.hbs", {
        title: "Log in"
    });
});

app.post("/login", urlencodedParser, [
        check('login')
            .trim()
            .escape()
            .custom(login  => {
                return User.loginExists(login).then(user => {
                    if(!user) return Promise.reject();
                });
            })
            .withMessage('Login doesn\'t exists'),

        check('password')
            .custom((password, {req}) => {
                let login = req.body.login;
                return User.passwordExists(login, password).then(user => {
                    if(!user) {
                        return Promise.reject();
                    }
                });
            })
            .withMessage('Wrong password'),
    ],
    function(request, response){
        const errors = validationResult(request);

        let login = request.body.login;
        let password = request.body.password;

        if (errors.isEmpty()) {
            User.findByLogin(login).then(user => {
                console.log("id"+user.id);
                request.session.user_id = user.id;
                response.redirect("/chat");
            })
        } else {
            response.render("login.hbs", {
                title: "Log in",
                login: login,
                password: password,
                errors: errors.array()
            });
        }
});

app.get("/register", function(request, response){
    response.render("registration.hbs", {
        title: "Registration"
    });
});

app.post("/register", urlencodedParser, [
        check('login')
            .trim()
            .escape()
            .not().isEmpty()
            .withMessage('Login shouldn\'t be empty')
            .custom(login =>  {
                return User.loginExists(login).then(user => {
                    if(user) return Promise.reject();
                });
            }).withMessage('Login already registered'),

        check('password')
            .isLength({min: 5})
            .withMessage('Your password must be at least 5 characters'),
    ],
    function(request, response){
        const errors = validationResult(request);

        let login = request.body.login;
        let password = request.body.password;

        if (errors.isEmpty()) {
            User.create({
                login: login,
                password: password
            }).then(user => {
                    request.session.user_id = user.id;
                    response.redirect("/chat")
                }
            ).catch(err=>console.log(err));
        } else {
            response.render("registration.hbs", {
                title: "Registration",
                login: login,
                password: password,
                errors: errors.array()
            });
        }
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});