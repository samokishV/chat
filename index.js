const express = require("express");
const expressHbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');

const User = require("./user.js");

const app = express();

const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

app.engine("hbs", expressHbs({
        layoutsDir: "views/layouts",
        defaultLayout: "layout",
        extname: "hbs"
    }
));

app.get(["/", "/chat"], function(request, response){
    response.send("<h2>Chat page</h2>");
});

app.get("/login", function(request, response){
    response.render("login.hbs");
});

app.get("/register", function(request, response){
    response.render("registration.hbs", {
        title: "Registration"
    });
});

app.post("/register", urlencodedParser, [
        check('login').not().isEmpty().trim().escape()
            .custom((value, { req }) => {
                return new Promise((resolve, reject) => {
                    User.findOne({where: {login: value}}).then(user=>{
                        if(!user) resolve();
                        else reject();
                    }).catch(err=>console.log(err));
                });
            }).withMessage('Login is already taken.'),
        check('password').not().isEmpty().isLength({min: 5}).withMessage('Your password must be at least 5 characters'),
    ],
    function(request, response){
        const errors = validationResult(request);
        console.log(errors);

        var login = request.body.login;
        var password = request.body.password;

        if (errors.isEmpty()) {
            User.create({
                login: login,
                password: password
            }).then(
                response.redirect("/chat")
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