angular.module('recipe').controller('recipeController', [
  '$scope',
  '$http',
  'applicationState',
  ($scope, $http, applicationState) => {

    // inital load event to get user recipes
    $http({
      method: 'GET',
      url: '/getUserRecipes',
    }).then((response) => {
      $scope.recipes = response.data;
    }, (response) => {
      // failure
      console.log(response);
    });

    // get tabs ready for detail page
    $scope.tab = {};
    $scope.tab.serving = true;
    $scope.tab.tabButton = () => {
      $scope.tab.serving = !$scope.tab.serving;
    };
    $scope.detail = applicationState.detail || 0;

    $scope.saveRecipe = () => {
      console.log($scope.recipeName, $scope.recipeInput, $scope.numServings);
    };

    $scope.loadDetail = (ind) => {
      $scope.detail = applicationState.detail = ind;
      window.location.href = '/#/detail';
    };
  },
]);
