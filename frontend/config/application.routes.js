angular.module('getFit')
  .config(($stateProvider, $urlRouterProvider, $anchorScrollProvider, $provide) => {
    $anchorScrollProvider.disableAutoScrolling();
    $urlRouterProvider.otherwise('/home');

    // prevent page from scrolling to the view as it loads
    $provide.decorator('$uiViewScroll', () => {
      return () => {
        window.scrollTo(0, top);
      };
    });

    // routes!
    $stateProvider

      .state('home', {
        url: '/home',
        templateUrl: 'views/recipes.view.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.view.html',
      })
      .state('new', {
        url: '/new',
        templateUrl: 'views/edit.recipe.view.html',
      });
  });
