const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');

const User = require("./user.js");

const app = express();

app.use(cookieParser());
// Use the session middleware
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
}));

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

app.engine("hbs", expressHbs({
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
));

app.get(["/", "/chat"], function(request, response){
    response.send("<h2>Chat page</h2>" +
        "user_id" + request.session.user_id);
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

app.listen(3000);