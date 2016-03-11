angular.module('recipe').controller('recipeController', [
  '$scope',
  '$http',
  ($scope, $http) => {

    // testing testing
    $scope.test = 'what the heck';

    $scope.saveRecipe = () => {
      console.log($scope.recipeName, $scope.recipeInput, $scope.numServings);
    };

    // inital load event to get user recipes
    $http({
      method: 'GET',
      url: '/getUserRecipes',
    }).then((response) => {
      $scope.recipes = response.data;
      console.log(response);
    }, (response) => {
      // failure
      console.log(response);
    });
  },
]);
