const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const configDB = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(express.static('./frontend'));

// passport
app.use(session({
  secret: 'thisisthehookitiscatchyandyoulikeit',
}));
app.use(passport.initialize());
app.use(passport.session());

// require('./app/routes/index.routes.js')(app);
require('./app/routes/recipe.routes.js')(app);
require('./app/routes/user.routes.js')(app, passport);

app.listen(3030, '127.0.0.1');
console.log('get-fit running at http://localhost:3030/');
