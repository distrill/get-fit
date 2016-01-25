const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({ /* eslint "new-cap": 0 */
  name: String,
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

mongoose.model('Item', itemSchema);
