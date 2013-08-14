(function () {
'use strict';

// Declare app level module which depends on filters, and services
angular.module('explorer',
    [
        'explorer.filters',
        'explorer.services',
        'explorer.directives',
        'explorer.tmpls',
        'explorer.controllers',
        'ui.utils',
        'infinite-scroll',
        'ui.bootstrap',
        'ngSanitize'
    ]
  )
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/collections', {templateUrl: 'partials/collections-list.html', controller: 'CollectionsCtrl'})
                  .when('/collections/:parentId', {templateUrl: 'partials/collections-search.html', controller: 'SearchCtrl'})
                  .when('/item/:itemId', {templateUrl: 'partials/item-default-view.html', controller: 'ItemCtrl'})
                  .otherwise({redirectTo: '/collections'});
  }])
  .constant('APP_CONFIG',{
        baseUrl:'https://beta.sciencebase.gov'
  });

}());