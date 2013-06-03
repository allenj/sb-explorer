'use strict';


var COLLECTIONS_PARENT_ID = "5137a368e4b066106b2eb640";
// var COLLECTIONS_PARENT_ID = "4f3559d2da0661d9ec041a0a";
/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', '$http', 'ItemsResult', function ($scope, $http, ItemsResult) {
        var itemsResult = ItemsResult.query({
            parentId: COLLECTIONS_PARENT_ID,
            fields: 'title,summary'
        }, function() {
            var collections = itemsResult.items;
            // split the items in half into 2 columns
            var half = Math.ceil(collections.length / 2);
            $scope.col1 = collections.slice(0, half);
            $scope.col2 = [];
            if (half > 1) {
                $scope.col2 = collections.slice(half, collections.length);
            }
        });

        $scope.search = function(query) {
            var itemsResult = ItemsResult.query({
                folderId: COLLECTIONS_PARENT_ID,
                fields: 'id,ancestors,parentId',
                q: query
            }, function() {

            });
        };
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'ItemsResult', 'Item', function ($scope, $routeParams, $location, ItemsResult, Item) {
        $scope.parentId = $routeParams.parentId;
        $scope.items = [];
        $scope.facets = [];

        // Load Items
        var query = {
            filter: "ancestors=" + $routeParams.parentId,
            fields: "title,summary,distributionLinks",
            facets: "browseCategory,browseType",
            offset: 0,
            max: 20
        };
        $.extend(query, $location.search());
        var itemResult = ItemsResult.query(query, function() {
            $scope.items = itemResult.items;
            $scope.facets = itemResult.searchFacets;
        });


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

    }]);
