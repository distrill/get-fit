'use strict';


// TODO
// pattern matching is fragile atm, so if sugar is an ingredient it will not
// get the actual value, but split too early.
// any other similar conflicts?
const rp = require('request-promise');
const urlencode = require('urlencode');
const Recipe = require('./../models/recipe.model');
const config = require('../../config/config');

module.exports.renderNewRecipe = (req, res) => {
  res.render('newRecipe', {
    title: 'Get Fit - New Recipe',
  });
};

module.exports.newRecipe = (req, res) => {
  console.log('new recipe');
  // initial total values, will be incremented as ingredients are added
  const total = {
    totalCalories: 0,
    totalFat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbohydrates: 0,
    fiber: 0,
    sugar: 0,
    protein: 0,
  };
  const serving = {
    totalCalories: 0,
    totalFat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbohydrates: 0,
    fiber: 0,
    sugar: 0,
    protein: 0,
  };
  // split input into ingredients, promise on each ingredient
  Promise.all(req.body.recipeInput.split(', ').map((item) => {
    const url =
      'http://api.wolframalpha.com/v2/query?appid=' + config.wolframId +
      '&input=' + urlencode(item) +
      '&format=plaintext';
    const options = {
      uri: url,
      json: true,
    };
    // request promise for each in array
    return rp(options)
      .then((response) => {
        // init values to swap out from plaintext
        const result = {
          name: item,
          totalCalories: 'total calories',
          totalFat: 'total fat',
          saturatedFat: 'saturated fat',
          cholesterol: 'cholesterol',
          sodium: 'sodium',
          totalCarbohydrates: 'total carbohydrates',
          fiber: 'fiber',
          sugar: 'sugar',
          protein: 'protein',
        };
        // hacky value-swap in plain-text
        for (const i in result) {
          if (result.hasOwnProperty(i) && i !== 'name') {
            // split on 'serving size' to get rid of extra text before
            // this helps when ingredient is the same as one of the nutrition
            // facts. most commonly (or only) sugar.
            const nutrition = response.split('serving size')[1];
            const temp = nutrition.split(result[i])[1].split(' ');
            result[i] = temp[2] || 0;
            // normalize if mg, we want everything in g
            if (temp[3] === 'mg') {
              result[i] /= 1000;
            }
            // normalize for microgram, we still want everything in g
            if (urlencode(temp[3]) === '%C2%B5g') {
              result[i] /= 100000;
            }
            total[i] += Math.round(parseFloat(result[i]) * 100) / 100;
            serving[i] += Math.round((parseFloat(result[i]) / req.body.numServings) * 100) / 100;
          }
        }
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  })).then((data) => {
    const newRecipe = new Recipe();
    newRecipe.name = req.body.name || 'New Recipe';
    newRecipe.servings = req.body.numServings || 1;
    newRecipe.ingredients = data;
    newRecipe.total = total;
    newRecipe.serving = serving;
    if (req.user) {
      newRecipe.user = req.user.facebook.id;
      newRecipe.save((err) => {
        if (err) {
          throw err;
        }
        res.json(newRecipe);
      });
    } else {
      res.json(newRecipe);
    }
  });
};
