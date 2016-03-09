const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../app/models/user.model');
const configAuth = require('./auth');

const localSignup = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  process.nextTick(() => {
    // see if user already exists
    User.findOne({
      'local.email': email,
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('signupMessage', 'Email Already Taken'));
      }
      // user does not already exists, all is well, carry on
      const newUser = new User();

      newUser.local.email = email;
      newUser.local.password = newUser.generateHash(password);

      newUser.save((nsErr) => {
        if (nsErr) {
          throw err;
        }
        return done(null, newUser);
      });
    });
  });
});

const localLogin = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  // see if user exists
  User.findOne({
    'local.email': email,
  }, (err, user) => {
    // error
    if (err) {
      return done(err);
    }

    // no user
    if (!user) {
      return done(null, false, req.flash('loginMessage', 'No user found'));
    }

    // user found, wrong password
    if (!user.validPassword(password)) {
      return done(null, false, req.flash('loginMessage', 'Wrong password'));
    }

    // all is well, carry on
    return done(null, user);
  });
});

const facebook = new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL,
}, (token, refreshToken, profile, done) => {
  process.nextTick(() => {

    // find user in db based on their facebook id
    User.findOne({
      'facebook.id': profile.id,
    }, (err, user) => {
      // error
      if (err) {
        return done(err);
      }

      // user found, log them in
      if (user) {
        return done(null, user);
      }

      // no user found with that id, create them
      const newUser = new User();

      // set facebook info
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name = profile.displayName;

      // save new user to db
      newUser.save((saveErr) => {
        if (saveErr) {
          throw err;
        }
        return done(null, newUser);
      });
    });
  });
});

module.exports = {
  localSignup,
  localLogin,
  facebook,
};
