const express =require('express');
const morgan =require('morgan');
const bodyParser =require('body-parser');
const cookieParser= require('cookie-parser');
const session= require('express-session');
//const cookieSession = require("cookie-session");

const app =express();

// Middlewares
// set morgan to log info about our requests for development use.
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.

//app.use(session());
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: true,
    saveUninitialized: true,
})); 

// Routes
app.use('/users',require('./routes/users'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening at ${port}');