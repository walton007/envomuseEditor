'use strict';

/**
 * @ngdoc overview
 * @name envomusMusicEditor
 * @description
 * # envomusMusicEditor
 *
 * Main module of the application.
 */
angular
  .module('envomusMusicEditor', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngLodash',
    'angularMoment',
    'ui.bootstrap',
    'dialogs.main',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/box/:boxId', {
        templateUrl: 'views/box.html',
        controller: 'BoxCtrl as controller'
      })
      .when('/period', {
        templateUrl: 'views/period.html',
        controller: 'PeriodCtrl'
      })
      .when('/help', {
        templateUrl: 'views/help.html'
      })
      .otherwise({
        redirectTo: '/main'
      });
  })
  .run(['$rootScope', '$interval', '$log',
   function($rootScope, $interval, $log) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      
    });
  }]);


