const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ /* eslint "new-cap": 0 */
  name: String,
});

mongoose.model('User', userSchema);
