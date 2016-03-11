const recipes = require('../controllers/recipe.controller.js');

module.exports = function recipeRoutes(app) {
  app.route('/newRecipe')
    .get(recipes.renderNewRecipe)
    .post(recipes.newRecipe);

  app.route('/getUserRecipes')
    .get(recipes.getUserRecipes);
};
