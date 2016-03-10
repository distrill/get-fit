/* eslint-disable new-cap */

const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
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

const recipeSchema = mongoose.Schema({
  name: String,
  user: String,
  servings: Number,
  ingredients: [ingredientSchema],
  total: ingredientSchema,
  serving: ingredientSchema,
});

module.exports = mongoose.model('Recipe', recipeSchema);
