'use strict';

/* Services */
// var HOSTNAME = "https://beta.sciencebase.gov";
var HOSTNAME = "http://localhost\\:8090";


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('explorer.services', ['ngResource']).
    factory('ItemsResult', function($resource) {
        return $resource(HOSTNAME + '/catalog/items', {}, {
            query: {method: 'GET'}
        });
    })
    .factory('Item', function($resource) {
        return $resource(HOSTNAME + '/catalog/item/:itemId', {itemId: '@id'}, {
            get: {method: 'GET'}
        });
    })
    .value('version', '0.1');
