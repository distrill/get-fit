module.exports = (app, passport) => {
  // home page
  app.route('/')
    .get((req, res) => {
      if (req.user) {
        res.render('newRecipe', {});
      } else {
        res.render('index', {});
      }
    });

  // facebook
  app.route('/auth/facebook')
    .get(passport.authenticate('facebook', { scope: 'email' }));
  app.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      successRedirect: '/start',
      failureRedirect: '/',
    }));

  // profile page
  app.route('/profile', isLoggedIn)
    .get((req, res) => {
      res.render('profile', {
        user: req.user,
      });
    });

  // gtfo
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  const isLoggedIn = (req, res, next) => {
    // if user is authenticated in session, carry on
    if (req.isAuthenticated()) {
      return next();
    }
    // if not fuck off
    res.redirect('/');
  };
};
