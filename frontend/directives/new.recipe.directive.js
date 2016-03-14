angular.module('recipe')
  .directive('newRecipe', () => {
    return {
      restrict: 'E',
      scope: {
        tab: '=tab',
      },
      templateUrl: 'views/directives/new.recipe.directive.view.html',
    };
  });
