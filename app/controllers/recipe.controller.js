'use strict';

const rp = require('request-promise');
const urlencode = require('urlencode');

const config = require('../../config/config');

module.exports.renderNewRecipe = (req, res) => {
  res.render('newRecipe', {
    title: 'Get Fit - New Recipe',
  });
};

module.exports.newRecipe = (req, res) => {
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
            result[i] = temp[2] || 'no data found';
            // normalize if mg, we want everything in g
            if (temp[3] === 'mg') {
              result[i] /= 1000;
            }
            total[i] += parseFloat(result[i], 10);
            serving[i] += parseFloat(result[i], 10) / req.body.numServings;
          }
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  })).then((data) => {
    data.push(total);
    data.push(serving);
    console.log('Totals:');
    console.log(total);
    console.log('\n\nServings:');
    console.log(serving);
    res.json(data);
  });
};
