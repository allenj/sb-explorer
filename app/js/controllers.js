'use strict';


var COLLECTIONS_PARENT_ID = "5137a368e4b066106b2eb640";
// var COLLECTIONS_PARENT_ID = "4f3559d2da0661d9ec041a0a";
/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.setPlaceHolder('Search Data Collections');
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
    }])
    .controller('NavCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        $scope.doSearch = function() {
            SearchService.search($scope.q);
        };

        $scope.$on('clear_search', function() {
            $scope.q = '';
        });
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'SearchService', '$rootScope', function ($scope, $routeParams, $location, SearchService, $rootScope) {
        SearchService.setPlaceHolder('Search Data');
        SearchService.fields = ['title', 'summary', 'distributionLinks'];
        SearchService.facets = ['browseCategory', 'browseType', 'partyWithName', 'facets.facetName', 'tagNameForTypeAndScheme'];
        SearchService.filters = {'ancestors': $routeParams.parentId};

        $scope.parentId = $routeParams.parentId;
        $scope.items = [];
        $scope.itemsTotal = 0;
        $scope.searchFacets = [];
        $scope.busy = false;
        $scope.offset = 0;
        $scope.filterCount = 0;
        $scope.queryParams = $.param($location.search());

        $scope.$on('new_items', function() {
            $scope.items = $scope.items.concat(SearchService.items);
            $scope.itemsTotal = SearchService.itemsTotal;
            $scope.searchFacets = SearchService.searchFacets;
            $scope.busy = false;
            $scope.filterCount = SearchService.filterCount();
        });

        SearchService.searchParams = $location.search();

        $rootScope.$broadcast('clear_search');
        SearchService.search();

        // Infinite scroll
        $scope.nextPage = function() {
            if ($scope.busy) return;
            $scope.busy = true;
            $scope.offset += 20;
            SearchService.searchParams['offset'] = $scope.offset;
            SearchService.search();
        };

        $scope.addFilter = function(facet, term) {
            SearchService.filters[facet] = term;
            SearchService.searchFacets
            SearchService.search();
        };

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
