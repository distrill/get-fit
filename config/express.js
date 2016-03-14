const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

module.exports = (passport) => {

  const app = express();

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

  return app;
};
