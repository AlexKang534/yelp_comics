//==================================
//IMPORTS
//=================================
//NPM Imports

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan')
const mongoose = require('mongoose');
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

//Config Import
const config = require('./config')

//Route Imports
const comicRoutes = require('./routes/comics');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

//Model Imports
const Comic = require('./models/comic');
const Comment = require('./models/comment');
const User = require('./models/user');


//===============================
// DEVELOPMENT
// ==============================
// Morgan
app.use(morgan('tiny'))

//Seed the DB
//const seed = require('./utils/seed');
//seed();

//===============================
// CONFIG
// ==============================
// Connect to DB
mongoose.connect(config.db.connection, {useNewUrlParser: true,});


// Express Config
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Express Session Config
app.use(expressSession({
	secret: 'a;sldfjkaspeoirjawepjiroawprjioariojaweraerja',
	resave: false,
	saveUninitialized: false
}));

//Body Parser Config
app.use(bodyParser.urlencoded({extended: true})); 

//Method Override Config
app.use(methodOverride('_method'));

//passport config
app.use(passport.initialize());
app.use(passport.session()); // allows persistent sessions
passport.serializeUser(User.serializeUser()); // what data to be stored in the session
passport.deserializeUser(User.deserializeUser()); //gets the user data from stored session
passport.use(new LocalStrategy(User.authenticate())); // use local strategy 

//current user middleware config
app.use((req, res, next) => {
	res.locals.user = req.user; 
	next();
})


//Route Config
app.use("/comics", comicRoutes);
app.use("/comics/:id/comments/", commentRoutes);
app.use("/", mainRoutes);
app.use('/', authRoutes); 


//Listen
app.listen(3000, () => {
	console.log("Yelp is running")
})