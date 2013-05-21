'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('explorer.services', ['ngResource']).
    factory('ItemsResult', function($resource) {
        return $resource('https://www.sciencebase.gov/catalog/items', {}, {
            query: {method: 'GET'}
        });
    })
    .factory('Item', function($resource) {
        return $resource('https://www.sciencebase.gov/catalog/item/:itemId', {itemId: '@id'}, {
            get: {method: 'GET'}
        });
    })
    .value('version', '0.1');
