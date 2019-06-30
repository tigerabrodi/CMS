// require('dotenv').config()
const path = require('path');
const fs = require("fs");
const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const passport = require("passport");
const helmet = require("helmet");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require('./controllers/error');
const compression = require("compression");
const morgan = require("morgan");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qb6i7.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const app = express();
const csrf = require("csurf");
const {
    User,
    Post
} = require("./models/model");

// passport config
require("./config/passport")(passport);


// session store
const store = new MongoDBStore({
    uri: MONGODB_URI,
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

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), {
        flags: 'a'
    }
);


app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static(path.join(__dirname, 'public')));

// session 
app.use(
    session({
        secret: "my secret",
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
app.use(helmet());
app.use(compression());
app.use(morgan('combined', {
    stream: accessLogStream
}));

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

console.log(`${process.env.MONGO_PASSWORD}`);
console.log(`${process.env.MONGO_USER}`);


// connection to mongodb
mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true
    })
    .then(result => {
        app.listen(process.env.PORT || 3000, () => {
            console.log("listening on port 3000");
        })
    })
    .catch(err => {
        console.log(err);
    })