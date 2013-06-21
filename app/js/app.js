'use strict';


// Declare app level module which depends on filters, and services
angular.module('explorer',
    [
        'explorer.filters',
        'explorer.services',
        'explorer.directives',
        'explorer.controllers',
        'ui.utils',
        'infinite-scroll',
        'ui.bootstrap'
    ]
  )
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/collections', {templateUrl: 'partials/collections-list.html', controller: 'CollectionsCtrl'})
                  .when('/collections/:parentId', {templateUrl: 'partials/collections-search.html', controller: 'SearchCtrl'})
                  .otherwise({redirectTo: '/collections'});
  }]);
