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
        self.itemsTotal   = 0;
        self.searchFacets = [];
        self._filterCount = 0;
        self.placeHolder  = "";

        self.search = function(searchString) {
            self.searchParams['q'] = searchString ? searchString : '';

            var result = ItemsResult.query(self._getSearchObj(self), function() {
                self.items = result.items;
                self.itemsTotal = result.total;
                self.searchFacets = result.searchFacets;
                $rootScope.$broadcast('new_items');
            });
        };

        self._getSearchObj = function(queryObject) {
            var result = $.extend({}, queryObject.searchParams, {
                facets: queryObject.facets.join(','),
                fields: queryObject.fields.join(',')
            });

            var fc = self.filterCount();
            $.each(queryObject.filters, function(key, val) {
                result['filter' + fc] = key+"="+val;
                fc++;
            });

            return result;
        };

        self.filterCount = function() {
            var c = 0;
            $.each(self.searchParams, function(key, val) {
                if (key.indexOf('filter') >= 0) {
                     c++;
                }
            });
            self._filterCount = c;
            return c;
        };

        self.setPlaceHolder = function(s) {
            $rootScope.placeHolder = s;
        }

        return self;
    })
    .value('version', '0.1');
