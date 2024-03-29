//==================================
//IMPORTS
//=================================
//NPM Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
//const morgan = require('morgan')
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Config Import
try {
  var config = require("./config");
} catch (e) {
  console.log(
    "Could not import config. This probably means you're not working locally"
  );
  console.log(e);
}

//Route Imports
const comicRoutes = require("./routes/comics");
const commentRoutes = require("./routes/comments");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");

//Model Imports
const Comic = require("./models/comic");
const Comment = require("./models/comment");
const User = require("./models/user");

//===============================
// DEVELOPMENT
// ==============================
// Morgan
//app.use(morgan('tiny'))

//Seed the DB
//const seed = require('./utils/seed');
//seed();

//===============================
// CONFIG
// ==============================
// Connect to DB
try {
  mongoose.connect(config.db.connection, { useNewUrlParser: true });
} catch (e) {
  console.log(
    "Could not connect using config. This probably means you're not working locally"
  );
  mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true });
}

// Express Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);

//Express Session Config
app.use(
  expressSession({
    secret: process.env.ES_SECRET || config.expressSession.secret,
    resave: false,
    saveUninitialized: false,
  })
);

//Body Parser Config
app.use(bodyParser.urlencoded({ extended: true }));

//Method Override Config
app.use(methodOverride("_method"));

//Connect-Flash Config
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session()); // allows persistent sessions
passport.serializeUser(User.serializeUser()); // what data to be stored in the session
passport.deserializeUser(User.deserializeUser()); //gets the user data from stored session
passport.use(new LocalStrategy(User.authenticate())); // use local strategy

//State config
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

//Route Config
app.use("/comics", comicRoutes);
app.use("/comics/:id/comments/", commentRoutes);
app.use("/", mainRoutes);
app.use("/", authRoutes);

//Listen
app.listen(process.env.PORT || 5500, () => {
  console.log("Yelp is running");
});
