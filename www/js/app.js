// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('RideMexico',
  ['ionic',
   'starter.controllers',
   'ngCordova',
   'Database.controllers',
   'ngMap'
   //'Map.controllers',
  // 'Search.controllers',
   //'Personal.controllers'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.database', {
    url: '/database',
    views: {
      'menuContent': {
        templateUrl: 'templates/database.html'
      }
    },
    controller: 'DatabaseMenuCtrl'
  })

  .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })
    .state('app.personalVehicle', {
      url: '/personalVehicle',
      views: {
        'menuContent': {
          templateUrl: 'templates/personalVehicle.html',
          //controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
      //  controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.busRouteList', {
    url: '/database/busRoute',
    views: {
      'menuContent':{
        templateUrl: 'templates/routes.html',
        controller: 'BusRoutesListController'
      }
    }
  })

  .state('app.trainRouteList', {
    url: '/database/trainRoute',
    views: {
      'menuContent':{
        templateUrl: 'templates/routes.html',
        controller: 'TrainRoutesListController'
      }
    }
  })

  .state('app.metroRouteList', {
    url: '/database/metroRoute',
    views: {
      'menuContent':{
        templateUrl: 'templates/routes.html',
        controller: 'MetroRoutesListController'
      }
    }
  })
  .state('app.metroRoute', {
    url: '/database/metroRoute/:routeId',
    views: {
      'menuContent':{
    templateUrl: 'templates/metroRoute.html',
    controller: 'MetroRouteController'
      }
    }
  })
  .state('app.stopMap', {
    url: '/database/metroRoute/stop/:lat/:lon/:name/:desc',
    views: {
      'menuContent':{
        templateUrl: 'templates/stop.html',
        controller: 'StopMapController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/database');
});
