'use strict';

const rp = require('request-promise');
const urlencode = require('urlencode');
const Recipe = require('./../models/recipe.model');
const config = require('../../config/config');

module.exports.renderNewRecipe = (req, res) => {
  res.render('newRecipe', {
    title: 'Get Fit - New Recipe',
  });
};

module.exports.getUserRecipes = (req, res) => {
  try {
    Recipe.find({
      user: req.user.facebook.id,
    }, (err, recipes) => {
      if (err) {
        throw err;
      } else {
        res.json(recipes);
        // process.exit();
      }
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

module.exports.newRecipe = (req, res) => {
  const numServings = req.body.numServings || 1;
  try {
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
          ingredient: item,
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
          if (result.hasOwnProperty(i) && i !== 'ingredient') {
            const temp = response.split(result[i])[1].split(' ');
            result[i] = parseFloat(temp[2]) || 0;
            // normalize if mg, we want everything in g
            if (temp[3] === 'mg') {
              result[i] /= 1000;
            }
            // normalize for microgram, we still want everything in g
            if (urlencode(temp[3]) === '%C2%B5g') {
              result[i] /= 100000;
            }
            total[i] += result[i];
            serving[i] += result[i] / numServings;
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
      newRecipe.name = req.body.name;
      newRecipe.servings = req.body.numServings;
      newRecipe.ingredients = data;
      // damnit sanitize again
      for (const i in total) {
        if (total.hasOwnProperty(i)) {
          total[i] = toFixedDown(total[i], 2);
          serving[i] = toFixedDown(serving[i], 2);
        }
      }
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
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

module.exports.deleteRecipe = (req, res) => {
  try {
    // find and remove element in question
    Recipe.findOne({
      _id: req.body.recipe._id,
    }, (err, recipe) => {
      if (err) {
        // error handle
        res.json({
          error: err,
        });
      } else {
        recipe.remove((delErr) => {
          if (delErr) {
            res.json({
              error: delErr,
            });
          } else {
            // successful remove
            Recipe.find({
              user: req.user.facebook.id,
            }, (findErr, recipes) => {
              if (findErr) {
                // basic error handle
                res.json({
                  error: findErr,
                });
              } else {
                // return user's remaining recipes
                res.json(recipes);
              }
            });
          }
        });
      }
    });
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

const toFixedDown = (num, digits) => {
  const re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)');
  const m = num.toString().match(re);
  return m ? parseFloat(m[1]) : num.valueOf();
};
