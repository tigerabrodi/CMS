require('dotenv').config({
    path: "node.env"
});
const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const passport = require("passport");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require('./controllers/error');

const mongodb_uri = process.env.MONGODB_URI;
const app = express();
const csrf = require("csurf");
const {User, Post} = require("./models/model");

// passport config
require("./config/passport")(passport);


// session store
const store = new MongoDBStore({
    uri: mongodb_uri,
    collection: "sessions"
});


const csrfProtection = csrf();

// ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

//  require routes
const adminRoutes = require("./routes/admin");
const blogRoutes = require("./routes/blog");
const authRoutes = require("./routes/auth");


app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static(path.join(__dirname, 'public')));

// session 
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


// using pasport aswell as flash and csrf
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csrfProtection);

// global variables
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// using the routes
app.use(adminRoutes);
app.use(blogRoutes);
app.use(authRoutes);


app.use(errorController.get404);


mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


// connection to mongodb
mongoose.connect(mongodb_uri, {
    useNewUrlParser: true
});


app.listen(process.env.PORT || 3000, function () {
    console.log("listening to port 3000")
})