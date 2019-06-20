require('dotenv').config({path: "node.env"});
const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require("connect-flash");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require('./controllers/error');

const mongodb_uri = process.env.MONGODB_URI;
const app = express();
const csrf = require("csurf");
const User = require("./models/user");

const store = new MongoDBStore({
    uri: mongodb_uri,
    collection: "sessions"
});


const csrfProtection = csrf();


app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require("./routes/admin");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");


app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static(path.join(__dirname, 'public')));


app.use(
    session({
        secret: process.env.SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        },
        store: store,
        resave: false,
        saveUninitialized: false,
        
    })
);


app.use(flash());
app.use(csrfProtection);


app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


app.use(adminRoutes);
app.use(blogRoutes);
app.use(authRoutes);


app.use(errorController.get404);


mongoose.set('useCreateIndex', true);


mongoose.connect(mongodb_uri, {
    useNewUrlParser: true
});


app.listen(3000, function () {
    console.log("listening to port 3000")
})