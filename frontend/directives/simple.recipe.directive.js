angular.module('recipe')
  .directive('simpleRecipe', () => {
    return {
      restrict: 'E',
      scope: {
        recipeInfo: '=recipe',
      },
      templateUrl: 'views/directives/simple.recipe.directive.view.html',
    };
  });
