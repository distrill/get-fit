const recipes = require('../controllers/recipe.controller.js');

module.exports = function recipeRoutes(app) {
  app.route('/newRecipe')
    .post(recipes.newRecipe);

  app.route('/deleteRecipe')
    .post(recipes.deleteRecipe);

  app.route('/getUserRecipes')
    .get(recipes.getUserRecipes);
};
