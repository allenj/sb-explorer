'use strict';

/* Services */
var HOSTNAME = "https://beta.sciencebase.gov";
// var HOSTNAME = "http://localhost\\:8090";

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
    .factory('SearchService', function(ItemsResult, $rootScope) {
        var self = this;
        self.searchParams = {};
        self.facets       = [];
        self.filters      = {};
        self.fields       = [];
        self.items        = [];
        self.searchFacets = [];

        self.search = function(searchString) {
            self.searchParams['q'] = searchString ? searchString : '';

            var result = ItemsResult.query(self._getSearchObj(), function() {
                self.items = result.items;
                self.searchFacets = result.searchFacets;
                $rootScope.$broadcast('new_items');
            });
        };

        self._getSearchObj = function() {
            var result = $.extend({}, self.searchParams, {
                facets: self.facets.join(','),
                fields: self.fields.join(',')
            });

            $.each(self.filters, function(idx, val) {
                result['filter' + idx] = val;
            });

            return result;
        };

        return self;
    })
    .value('version', '0.1');
