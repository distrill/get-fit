'use strict';

// const wolframFit = require('wolfram-fit');
const request = require('request');

const config = require('../../config/config');

const Recipe = require('mongoose').model('Recipe');
const Item = require('mongoose').model('Item');
// const User = require('mongoose').model('User');

module.exports.renderNewRecipe = function renderNewRecipe(req, res) {
  res.render('newRecipe', {
    title: 'Get Fit - New Recipe',
  });
};

function itemFindCallback(err, item, initial, recipe) {
  if (err) {
    return console.error(err);
  } else if (item) {
    // local item match, add to recipe object
    recipe.items.push(item);
    recipe.save((err01) => {
      if (err01) {
        return console.error(err01);
      }
      console.log('item successfully added to recipe');
    });
  } else {
    // we have to get item information from wolfram
    const query = `http://api.wolframalpha.com/v2/query?appid=${config.wolframId}&input=${initial}&format=plaintext`;
    request(query, (rqError, response) => {
      console.log(`request query start: ${initial}`);
      const startingString = response.body;
      if (!rqError) {
        const result = {
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
        for (const i in result) {
          if ({}.hasOwnProperty.call(result, i)) {
            result[i] = startingString.split(result[i])[1].split(' ')[2] || 'no data found';
          }
        }

        // turn item infor into new Item in db
        const newItem = new Item(result);
        newItem.name = initial;
        newItem.save((newItemError) => {
          if (newItemError) {
            return console.error(newItemError);
          }
          console.log('item successfully added to db:');
          console.dir(result);

          // add our new item to recipe object
          recipe.items.push(newItem);
          recipe.save((err02) => {
            if (err02) {
              return console.error(err02);
            }
            console.log('item successfully added to recipe');
          });
        });
      }
      console.log(`request query finish: ${initial}`);
    });
  }
}

function addRecipeToDB(recipeInput) {
  // break input into single items
  const initialInputs = recipeInput.split(' + ');

  // build recipe from Item objects
  // NOTE use real damn users. debugging with admin for now
  const newRecipe = new Recipe({
    name: recipeInput,
    user: '56a56e54c3d5063713676b89',
    items: [],
  });

  // check for matching local items, otherwise go through wofram
  for (let i = 0; i < initialInputs.length; i++) {
    Item.findOne({ name: initialInputs[i] }, (err, item) => { /* eslint "no-loop-func": 0 */
      itemFindCallback(err, item, initialInputs[i], newRecipe);
    });
  }

  // save our new recipe to db
  newRecipe.save((newRecipeSaveError) => {
    if (newRecipeSaveError) {
      return console.error(newRecipeSaveError);
    }
    console.log('recipe successfully added to db');
  });
}

module.exports.newRecipe = function newRecipe(req, res) {
  // check if recipe already exists
  const recipeInput = req.body.recipeInput.toLowerCase();
  Recipe.findOne({ name: recipeInput }, (err, recipe) => {
    if (err) {
      return console.error(err);
    } else if (recipe) {
      // recipe is already in database. move forward with it
      console.log('recipe already exists. do not make another one');
    } else {
      // recipe is not already in database. prepare and add it
      addRecipeToDB(recipeInput);
      res.redirect('/start');
    }
  });
};
