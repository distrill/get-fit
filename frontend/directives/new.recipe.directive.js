angular.module('recipe')
  .directive('newRecipe', () => {
    return {
      restrict: 'E',
      scope: {
        tab: '=tab',
        new: '=new',
      },
      templateUrl: 'views/directives/new.recipe.directive.view.html',
    };
  });
