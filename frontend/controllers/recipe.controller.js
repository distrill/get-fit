'use strict';

angular.module('recipe').controller('recipeController', [
  '$scope',
  '$http',
  '$window',
  '$timeout',
  'applicationState',
  ($scope, $http, $window, $timeout, applicationState) => {

    $scope.tab = {};
    $scope.detail = applicationState.detail || 0;
    $scope.removeIndex = 0;
    $scope.new = {
      modal: false,
    };

    // inital load event to get user recipes
    $http({
      method: 'GET',
      url: '/getUserRecipes',
    }).then((response) => {
      if (response.data.error) {
        $window.location.href = '/';
      }
      $scope.recipes = response.data;
    }, (response) => {
      // failure
      console.log('http fail:');
      console.log(response);
      $window.location.href = '/';
    });

    // get tabs ready for detail page
    $scope.tab.serving = true;
    $scope.tab.ingredients = false;
    $scope.tab.tabButton = () => {
      $scope.tab.serving = !$scope.tab.serving;
    };

    // get csv ready for add recipe page
    $scope.tab.csv = false;
    $scope.tab.recipe = {
      name: '',
      servings: '',
      ingredients: ['', ''],
      csv: '',
    };
    $scope.tab.values = [
      {
        name: '',
      },
    ];
    $scope.$watch('tab.values[tab.values.length-1].name', () => {
      if ($scope.tab.values[$scope.tab.values.length - 1].name !== '') {
        $scope.tab.values.push({
          name: '',
        });
      }
    });
    $scope.tab.csvButton = () => {
      $scope.tab.csv = !$scope.tab.csv;
      // move input from csv to fields
      if ($scope.tab.csv) {
        // just switched from fields to csv
        $scope.tab.recipe.csv = getCSVFromFields();
      } else {
        // just switched from csv to fields
        $scope.tab.values = getFieldsFromCSV();
      }
    };
    $scope.tab.delete = (index) => {
      console.log(index);
      if ($scope.tab.values.length > 1) {
        $scope.tab.values.splice(index, 1);
      }
    };
    $scope.tab.toggleIngredients = () => {
      $scope.tab.ingredients = !$scope.tab.ingredients;
    };

    $scope.openModal = (index) => {
      $scope.modal = true;
      $scope.removeIndex = index;
      console.log(index);
    };

    $scope.removeRecipe = () => {
      $scope.closeModal();
      const req = {
        method: 'POST',
        url: '/deleteRecipe',
        data: {
          recipe: $scope.recipes[$scope.removeIndex],
        },
      };
      $http(req)
      .then((response) => {
        // success
        console.log('remove success:');
        console.log(response);
        // should check for errors in response
        if (response.data.error) {
          $window.location.href = '/';
        }
        // set state and reload page with new items only
        $scope.recipes = response.data;
        $window.location.href = '/#/home';
      }, (response) => {
        // failure
        console.log('response fail:');
        console.log(response);
        $window.location.href = '/';
      });
    };

    $scope.tab.saveRecipe = () => {
      // modal that shit. lettem know we know they hit the button
      $scope.tab.modal = true;

      // check for valid input (servings is number, name exists, etc)
      const req = {
        method: 'POST',
        url: '/newRecipe',
        data: {
          name: $scope.tab.recipe.name,
          numServings: $scope.tab.recipe.servings || 1,
          recipeInput: ($scope.tab.csv) ? $scope.tab.recipe.csv : getCSVFromFields(),
        },
      };
      $http(req)
        .then((response) => {
          // success
          if (response.data.error) {
            $window.location.href = '/';
          } else {
            $scope.recipes.push(response.data);
            $scope.loadDetail($scope.recipes.length - 1);
          }
        }, (response) => {
          // failure :(
          console.log('http failure:');
          console.log(response);
          $window.location.href = '/';
        });
    };
    $scope.tab.closeModal = () => {
      $scope.tab.modal = false;
    };

    $scope.loadDetail = (ind) => {
      $window.scrollTo(0, 0);
      console.log(ind);
      $scope.detail = applicationState.detail = ind;
      window.location.href = '/#/detail';
    };

    $scope.closeModal = () => {
      $scope.modal = false;
    };

    const getCSVFromFields = () => {
      const ing = $scope.tab.values;
      let result = '';
      for (let i = 0; i < ing.length; i++) {
        // get element, add comma if not last element
        result += ing[i].name;
        if (i < ing.length - 2) {
          result += ', ';
        }
      }
      return result;
    };

    const getFieldsFromCSV = () => {
      const values = [];
      const ings = $scope.tab.recipe.csv.split(', ');
      for (let i = 0; i < ings.length; i++) {
        values.push({
          name: ings[i],
        });
      }
      return values;
    };

    $scope.initVals = ['list ingredients here'];

  },
]);
