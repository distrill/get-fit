const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({ /* eslint "new-cap": 0 */
  name: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
  }],
  totalCalories: {
    type: Number,
    default: 0,
  },
  totalFat: {
    type: Number,
    default: 0,
  },
  saturatedFat: {
    type: Number,
    default: 0,
  },
  cholesterol: {
    type: Number,
    default: 0,
  },
  sodium: {
    type: Number,
    default: 0,
  },
  totalCarbohydrates: {
    type: Number,
    default: 0,
  },
  fiber: {
    type: Number,
    default: 0,
  },
  sugar: {
    type: Number,
    default: 0,
  },
  protein: {
    type: Number,
    default: 0,
  },
});

mongoose.model('Recipe', recipeSchema);
