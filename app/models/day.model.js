const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = mongoose.Schema({ /* eslint "new-cap": 0 */
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  recipies: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  totalCalories: Number,
  totalFat: Number,
  saturatedFat: Number,
  cholesterol: Number,
  sodium: Number,
  totalCarbohydrates: Number,
  fiber: Number,
  sugar: Number,
  protein: Number,
});

mongoose.model('Day', daySchema);
