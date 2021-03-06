/* eslint-disable new-cap */

const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  ingredient: String,
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

const recipeSchema = mongoose.Schema({
  name: String,
  user: String,
  servings: Number,
  ingredients: [ingredientSchema],
  total: ingredientSchema,
  serving: ingredientSchema,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
