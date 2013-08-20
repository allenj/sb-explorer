(function () {

'use strict';

/* Services */

angular.module('explorer.services', ['ngResource']).
    factory('ItemsResult', function ($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.baseUrl + '/catalog/items', {}, {
            query: {method: 'GET'}
        });
    })
    .factory('Item', function ($resource, APP_CONFIG) {
        return $resource(APP_CONFIG.baseUrl + '/catalog/item/:itemId', {itemId: '@id'}, {
            get: {method: 'GET', params:{fields:'identifiers,title,subTitle,alternateTitles,summary,body,purpose,rights,' +
                'provenance,materialRequestInstructions,hasChildren,parentId,contacts,webLinks,browseCategories,browseTypes,' +
                'systemTypes,tags,dates,spatial,extents,facets,files,permissions?,distributionLinks,previewImage,locked,' +
                'relationships,usgscitation'}}
        });
    })
    .factory('SearchService', function (ItemsResult, $rootScope, Item) {
        var self = this;

        self.viewSettings = {
            view: 'gallery',
            collectionItem: null,
            showFilters: false
        };

        self.searchParams = {};
        self.facets       = [];
        self.filters      = [];
        self.fields       = [];
        self.items        = [];
        self.itemsTotal   = 0;
        self.searchFacets = [];
        self.placeHolder  = "";


        self.search = function (searchString) {
            self.searchParams.q = self.searchParams.q ? self.searchParams.q : searchString ? searchString : '';

            var result = ItemsResult.query(self._getSearchObj(self), function () {
                self.items = result.items;
                self.itemsTotal = result.total;
                self.searchFacets = result.searchFacets;
                $rootScope.$broadcast('new_items');
            });

            self.viewSettings.showFilters = self._checkFiltersForLabel();
        };

        self._getSearchObj = function (queryObject) {
            var result = $.extend({}, queryObject.searchParams, {
                facets: queryObject.facets.join(','),
                fields: queryObject.fields.join(',')
            });

            var fc = self.filterCount();
            $.each(queryObject.filters, function (idx, filter) {
                result['filter' + fc] = filter.key+"="+filter.val;
                fc++;
            });

            return result;
        };

        self.filterCount = function () {
            var c = 0;
            $.each(self.searchParams, function (key, val) {
                if (key.indexOf('filter') >= 0) {
                     c++;
                }
            });
            self._filterCount = c;
            return c;
        };

        self.setPlaceHolder = function (s) {
            $rootScope.placeHolder = s;
        };

        self.applyFilter = function (filterObj) {
            $rootScope.$broadcast('clear_items');
            self.searchParams.offset = 0;

            var facetName = filterObj.facet.name;
            if (facetName === 'tagType' || facetName === 'tagScheme' || facetName === 'tagNameForTypeAndScheme'){
                var tagFilter = {};
                var tagFilterValObj = {};

                jQuery.each(self.filters, function (index, value){
                    if (value.key === 'tags') {
                        var tagFilterArray = self.filters.splice(index,1);
                        tagFilter = tagFilterArray[0];
                        tagFilterValObj = jQuery.parseJSON(tagFilter.val);
                    }
                });

                if (facetName === 'tagType') tagFilterValObj.type = filterObj.val;
                if (facetName ==='tagScheme') tagFilterValObj.scheme = filterObj.val;
                if (facetName === 'tagNameForTypeAndScheme') tagFilterValObj.name = filterObj.val;

                var tagFilterVal = JSON.stringify(tagFilterValObj);

                self.filters.push({key: 'tags', val: tagFilterVal, filterLabel: 'Tags'});
            }
            else {
                self.filters.push({key: filterObj.facet.name, val: filterObj.val, filterLabel: filterObj.facet.label});
            }

            self.search(self.searchParams.q);
        };

        self.removeFilter = function (filterObj) {
            $rootScope.$broadcast('clear_items');
            self.searchParams.offset = 0;
            self.filters = $.grep(self.filters, function (elem) {
                return (!(elem.key === filterObj.facet.name && elem.val === filterObj.val));
            });
            self.search(self.searchParams.q);
        };

        self.applyQParams = function (paramObj) {
            if (paramObj.q) {
                self.searchParams.q = paramObj.q;
            }
            if (paramObj.filter) {
                var filterString = paramObj.filter;
                var filter = [];

                if (filterString.indexOf('%3D') > 0) {
                    filter = filterString.split("%3D");
                }
                if (filterString.indexOf('=') > 0) {
                    filter = filterString.split("=");
                }

                if (filter.length === 2) {
                    self.filters.push({key: filter[0], val: filter[1], filterLabel: filter[0]});
                }
            }
        };

        self.setCollectionId = function (collectionId) {
            self.viewSettings.collectionItem = {id: collectionId, title:'Collection ID#' + collectionId + ' (loading...)'};
            var item = Item.get({
                    itemId:collectionId},
                function () {
                    self.viewSettings.collectionItem =  {id: item.id, title: item.title, summary: item.summary};
                },
                function (response) {
                    //404 or bad
                    self.viewSettings.collectionItem = {id: collectionId, title:'Collection ID#' + collectionId, summary: 'Error: status=' + response.status};
                }
            );
        };

        self._checkFiltersForLabel = function () {
            var itemsWithFilterLabel = jQuery.grep(self.filters, function (n, i) {
                return (n.filterLabel !== undefined);
            });

            return itemsWithFilterLabel.length > 0;
        };

        return self;
    })
    .factory('ImageUtilService', function () {
        var self = this;

        self.galleryImageBlackList = [
            'http://pubs.er.usgs.gov/thumbnails/usgs_thumb.jpg',
            'http://pubs.er.usgs.gov/thumbnails/outside_thumb.jpg'];

        self.grabGalleryImageUri = function (item) {
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
    .factory('MapService', function () {
        var self = this;

        self.map = {};
        self.layers = [];

        self.removeLayerWithQuery = function (queryObj) {
            console.log(self.layers);
            jQuery.each(self.layers, function (idx, layer) {
                var coordinates = layer.toGeoJSON().geometry.coordinates[0];
                var layerQuery = JSON.stringify({type: 'envelope', coordinates: [coordinates[0], coordinates[2]]});

                if (queryObj === layerQuery) {
                    self.layers.splice(idx, 1);
                    self.map.removeLayer(layer);
                }
            });
        };

        return self;
    })
    .value('version', '0.1');


}());
