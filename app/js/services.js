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
        self.filters      = [];
        self.fields       = [];
        self.items        = [];
        self.itemsTotal   = 0;
        self.searchFacets = [];
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
            $.each(queryObject.filters, function(idx, filter) {
                result['filter' + fc] = filter.key+"="+filter.val;
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
        };

        self.applyFilter = function(facet, val) {
            $rootScope.$broadcast('clear_items');
            self.searchParams['offset'] = 0;
            self.filters.push({key: facet.name, val: val, facetLabel: facet.label});
            self.search(self.searchParams['q']);
        };

        self.removeFilter = function(key, val) {
            $rootScope.$broadcast('clear_items');
            self.searchParams['offset'] = 0;
            self.filters = $.grep(self.filters, function(elem) {
                return (!(elem.key == key && elem.val == val));
            });
            self.search(self.searchParams['q']);
        }

        return self;
    })
    .factory('ImageUtilService', function() {
        var self = this;

        self.browseImageBlackList = ['http://pubs.er.usgs.gov/thumbnails/usgs_thumb.jpg',
            'http://pubs.er.usgs.gov/thumbnails/outside_thumb.jpg'];

        return self;
    })
    .value('version', '0.1');
