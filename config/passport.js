const User = require('../app/models/user.model');
const strategies = require('./passport.strategies');

module.exports = (passport) => {
  // passport session setup
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // local signup
  passport.use('local-signup', strategies.localSignup);

  // local login
  passport.use('local-login', strategies.localLogin);

  // facebook signin/login
  passport.use(strategies.facebook);

};
