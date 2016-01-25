const mongoose = require('mongoose');


module.exports = function mongooseConnect() {
  mongoose.connect('mongodb://localhost/get-fit-dev');
  require('../app/models/user.model');
  require('../app/models/recipe.model');
  require('../app/models/item.model');
  require('../app/models/day.model');
};
