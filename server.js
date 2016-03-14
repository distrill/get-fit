const mongoose = require('mongoose');
const passport = require('passport');

const port = process.env.PORT || 3030;
const address = process.env.ADDRESS || '0.0.0.0';

const app = require('./config/express')(passport);
const configDB = require('./config/database');
mongoose.connect(configDB.url);

require('./config/passport')(passport);

require('./app/routes/recipe.routes.js')(app);
require('./app/routes/user.routes.js')(app, passport);

app.listen(port, address);
console.log('get-fit running at http://localhost:' + port + '/');
