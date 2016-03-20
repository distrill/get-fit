module.exports = {
  facebookAuth: {
    clientID: '483772485143045',
    clientSecret: 'e1b1f7dfebfeb3086b61804431d37045',
    callbackURL: (process.env.NODE_ENV === 'development') ?
      'http://localhost:3030/auth/facebook/callback' :
      'https://radiant-hollows-41289.herokuapp.com/auth/facebook/callback',
  },
};
