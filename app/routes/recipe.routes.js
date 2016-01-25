const recipes = require('../controllers/recipe.controller.js');

module.exports = function recipeRoutes(app) {
  app.route('/start')
    .get(recipes.renderNewRecipe)
    .post(recipes.newRecipe);
};
