'use strict';


var COLLECTIONS_PARENT_ID = "5137a368e4b066106b2eb640";
// var COLLECTIONS_PARENT_ID = "4f3559d2da0661d9ec041a0a";
/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.searchParams['parentId'] = COLLECTIONS_PARENT_ID;
        SearchService.fields = ['title', 'summary'];

        $scope.$on('new_items', function() {
            var half = Math.ceil(SearchService.items.length / 2);
            $scope.col1 = SearchService.items.slice(0, half);
            $scope.col2 = [];
            if (half > 1) {
                $scope.col2 = SearchService.items.slice(half, SearchService.items.length);
            }
        });

        SearchService.search();
        
        // var itemsResult = ItemsResult.query({
        //     parentId: COLLECTIONS_PARENT_ID,
        //     fields: 'title,summary'
        // }, function() {
        //     var collections = itemsResult.items;
        //     // split the items in half into 2 columns
        //     var half = Math.ceil(collections.length / 2);
        //     $scope.col1 = collections.slice(0, half);
        //     $scope.col2 = [];
        //     if (half > 1) {
        //         $scope.col2 = collections.slice(half, collections.length);
        //     }
        // });

        // $scope.search = function(query) {
        //     var itemsResult = ItemsResult.query({
        //         folderId: COLLECTIONS_PARENT_ID,
        //         fields: 'id,ancestors,parentId',
        //         q: query
        //     }, function() {

        //     });
        // };
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'ItemsResult', 'Item', '$rootScope', function ($scope, $routeParams, $location, ItemsResult, Item, $rootScope) {
        $scope.parentId = $routeParams.parentId;
        $scope.items = [];
        $scope.facets = [];
        $scope.filter = "";

        $rootScope.$watch('q', function(newVal, oldVal) {
            $scope.q = newVal;
        });

        var loadItems = function(query) {
            var itemsResult = ItemsResult.query(query, function() {
                $scope.items = itemsResult.items;
                $scope.facets = itemsResult.searchFacets;
            });
        };

        // Load Items
        var query = {
            filter: "ancestors=" + $routeParams.parentId,
            fields: "title,summary,distributionLinks,webLinks",
            facets: "browseCategory,browseType,partyWithName,facets.facetName,tagNameForTypeAndScheme",
            offset: 0,
            max: 20,
            q: $scope.q != null ? $scope.q : ""
        };
        $.extend(query, $location.search());
        loadItems(query);

        // Infinite scroll
        $scope.busy = false;
        $scope.offset = 0;
        $scope.nextPage = function() {
            if ($scope.busy) return;
            $scope.busy = true;
            $scope.offset += 20;
            query.offset = $scope.offset;
            var scrollResults = ItemsResult.query(query, function() {
                $scope.items = $scope.items.concat(scrollResults.items);
                $scope.facets = scrollResults.searchFacets;
                $scope.busy = false;
            });
        };

        // Search
        $scope.doSearch = function() {
            var query = {
                filter: "ancestors=" + $routeParams.parentId,
                fields: "title,summary,distributionLinks",
                facets: "browseCategory,browseType,partyWithName,facets.facetName",
                offset: 0,
                max: 20,
                q: $scope.q != null ? $scope.q : ""
            };
            $.extend(query, $location.search());
            loadItems(query);
        }

        $scope.grabBrowseImageUrl = function(item) {
            //return item.title;
//            console.log(item);
//            console.log(item.webLinks);
            if (item.webLinks){
                console.log(item);
                console.log(item.webLinks);
//                for (var webLink in item.webLinks){
//                    console.log ("webLink.type: " + webLink.type);
//                    console.log(webLink);
//                }
                for (var i = 0; i < item.webLinks.length; i++) {
                    var webLink = item.webLinks[i]
                    console.log ("webLink.type: " + webLink.type);
                    console.log(webLink);
                }
            }


            return 'http://libraryphoto.cr.usgs.gov/htmllib/btch355/btch355j/agi00144.gif';
        }

    }]);
