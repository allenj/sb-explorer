(function () {

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
            self.searchParams.q = searchString ? searchString : '';

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
            self.searchParams.offset = 0;

            var facetName = facet.name;
            if (facetName === 'tagType' || facetName === 'tagScheme' || facetName === 'tagNameForTypeAndScheme'){
                var tagFilter = {};
                var tagFilterValObj = {};

                jQuery.each(self.filters, function(index, value){
                    if (value.key === 'tags') {
                        var tagFilterArray = self.filters.splice(index,1);
                        tagFilter = tagFilterArray[0];
                        tagFilterValObj = jQuery.parseJSON(tagFilter.val);
                    }
                });

                if (facetName === 'tagType') tagFilterValObj.type = val;
                if (facetName ==='tagScheme') tagFilterValObj.scheme = val;
                if (facetName === 'tagNameForTypeAndScheme') tagFilterValObj.name = val;

                var tagFilterVal = JSON.stringify(tagFilterValObj);

                self.filters.push({key: 'tags', val: tagFilterVal, filterLabel: 'Tags'});
            }
            else {
                self.filters.push({key: facet.name, val: val, filterLabel: facet.label});
            }


            self.search(self.searchParams.q);
        };

        self.removeFilter = function(key, val) {
            $rootScope.$broadcast('clear_items');
            self.searchParams.offset = 0;
            self.filters = $.grep(self.filters, function(elem) {
                return (!(elem.key === key && elem.val === val));
            });
            self.search(self.searchParams.q);
        };

        return self;
    })
    .factory('ImageUtilService', function() {
        var self = this;

        self.galleryImageBlackList = [
            'http://pubs.er.usgs.gov/thumbnails/usgs_thumb.jpg',
            'http://pubs.er.usgs.gov/thumbnails/outside_thumb.jpg'];

        self.grabGalleryImageUri = function(item) {
            var galleryImageUri;
            if (item.previewImage){
                if (item.previewImage.medium && item.previewImage.medium.uri){
                    galleryImageUri = item.previewImage.medium.uri;
                }
                else if (item.previewImage.small && item.previewImage.small.uri){
                    galleryImageUri = item.previewImage.small.uri;
                }
            }
            else if (item.webLinks) {
                var found = false;
                for (var i = 0; (!found && i < item.webLinks.length); i++) {
                    var webLink = item.webLinks[i];
                    if (webLink.type && webLink.type === 'browseImage') {
                        found = true;
                        if (jQuery.inArray(webLink.uri, self.galleryImageBlackList) === -1){
                            galleryImageUri = webLink.uri;
                        }
                    }
                }
            }

            if (jQuery.inArray(galleryImageUri, self.galleryImageBlackList) >= 0){
                galleryImageUri = null;
            }

            return galleryImageUri;
        };


        return self;
    })
    .value('version', '0.1');


}());
