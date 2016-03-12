angular.module('recipe')
  .directive('detailRecipe', () => {
    return {
      restrict: 'E',
      scope: {
        recipeInfo: '=recipe',
        tab: '=tab',
        // detail: '=detail',
      },
      templateUrl: 'views/directives/detail.recipe.directive.view.html',
    };
  });
