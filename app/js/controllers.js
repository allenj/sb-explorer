'use strict';

/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', '$http', 'ItemsResult', function ($scope, $http, ItemsResult) {
        var itemsResult = ItemsResult.query({
            parentId: '5137a368e4b066106b2eb640',
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
                folderId: '5137a368e4b066106b2eb640',
                fields: 'id,ancestors,parentId',
                q: query
            }, function() {

            });
        };
    }])
    .controller('CollectionSearchCtrl', [ '$scope', '$routeParams', 'ItemsResult', 'Item', function ($scope, $routeParams, ItemsResult, Item) {
        var itemResult = ItemsResult.query({
            filter: "ancestors=" + $routeParams.collectionId,
            fields: "title,summary"
        }, function() {
            $scope.items = itemResult.items;
        });


        $scope.getDistLinks = function() {
            // var item = Item.get({itemId: });
        }
    }]);
