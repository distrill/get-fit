const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('./config/mongoose');

mongoose();
const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(express.static('./public'));

require('./app/routes/index.routes.js')(app);
require('./app/routes/recipe.routes.js')(app);

app.listen(3030, '127.0.0.1');

console.log('get-fit running at http://localhost:3030/');
