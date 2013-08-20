(function () {
'use strict';

/* Controllers */
angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.setPlaceHolder('Search Data Collections');
        SearchService.searchParams.browseCategory = 'Collection';
        SearchService.searchParams.offset = 0;
        SearchService.filters = [];
        SearchService.fields = ['title', 'summary'];

        $scope.$on('new_items', function () {
            var half = Math.ceil(SearchService.items.length / 2);
            $scope.col1 = SearchService.items.slice(0, half);
            $scope.col2 = [];
            if (half > 1) {
                $scope.col2 = SearchService.items.slice(half, SearchService.items.length);
            }
        });

        SearchService.search();
    }])
    .controller('NavCtrl', [ '$scope', '$rootScope', 'SearchService', '$location', function ($scope, $rootScope, SearchService, $location) {
        $scope.doSearch = function () {
            $rootScope.$broadcast('clear_items');
            SearchService.searchParams.offset = 0;
            SearchService.searchParams.q = $scope.q;
            SearchService.search($scope.q);
        };

        $scope.viewSettings = SearchService.viewSettings;

        $scope.$on('clear_search', function () {
            $scope.q = '';
        });

        $scope.$on('new_items', function () {
            if (SearchService.searchParams.q) $scope.q = SearchService.searchParams.q;
        });
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'SearchService', '$rootScope', function ($scope, $routeParams, $location, SearchService, $rootScope) {
        SearchService.setCollectionId($routeParams.parentId);
        SearchService.viewSettings.collectionId = $routeParams.parentId;
        $scope.viewSettings = SearchService.viewSettings;

        SearchService.setPlaceHolder('Search Data');
        SearchService.fields = ['title', 'summary', 'distributionLinks', 'webLinks','previewImage'];
        SearchService.facets = ['browseCategory', 'browseType', 'partyWithName', 'tagType','tagScheme', 'tagNameForTypeAndScheme'];
        SearchService.filters = [{key: 'ancestors', val: $routeParams.parentId}];

        SearchService.searchParams.offset = 0;
        delete SearchService.searchParams.browseCategory;

        var externalParams = $.deparam(window.location.search.substring(1));
        SearchService.applyQParams(externalParams);
        SearchService.applyQParams($location.search());

        $scope.items = [];
        $scope.itemsTotal = 0;
        $scope.searchFacets = [];
        $scope.busy = false;
        $scope.filterCount = 0;

        $scope.$on('new_items', function () {
            $scope.items = $scope.items.concat(SearchService.items);
            $scope.itemsTotal = SearchService.itemsTotal;
            $scope.searchFacets = SearchService.searchFacets;
            $scope.busy = false;
            $scope.filterCount = SearchService.filterCount();
            $scope.filters = SearchService.filters;
        });

        $scope.$on('clear_items', function () {
            $scope.items = [];
        });

        $rootScope.$broadcast('clear_search');
        SearchService.search();

        // Infinite scroll
        $scope.nextPage = function () {
            if ($scope.busy) return;
            $scope.busy = true;
            SearchService.searchParams.offset += 20;
            SearchService.search();
        };
    }])
    .controller('SlidesCtrl', [ '$scope', 'SearchService', 'ImageUtilService', function ($scope, SearchService, ImageUtilService) {
        $scope.slides = [];
        $scope.carouselInterval = 5000; //-1

        $scope.$on('new_items', function () {
            $.each(SearchService.items, function (index, item) {
                var ImageUri = ImageUtilService.grabGalleryImageUri(item);
                if (ImageUri) {
                    $scope.slides.push({image:ImageUri, title:item.title, text:item.summary, itemLink: item.link.url});
                }
            });
        });

        $scope.$on('clear_items', function () {
            $scope.slides = [];
        });

    }])
    .controller('DummySlidesCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        $scope.slides = dummySlides;
        $scope.carouselInterval = 5000;
    }])
    .controller('ItemCtrl', [ '$scope', '$routeParams', 'Item', 'SearchService', 'APP_CONFIG', function ($scope, $routeParams, Item, SearchService, APP_CONFIG) {
        $scope.message = null;
        $scope.APP_CONFIG = APP_CONFIG;
        var item = Item.get({
            itemId:$routeParams.itemId},
            function () {
                $scope.item = item;
                //if (!SearchService.viewSettings.collectionItem.id) SearchService.setCollectionId(item.parentId);
            },
            function (response) {
                //404 or bad
                $scope.item = null;
                if (response.status === 404) {
                    $scope.message = 'Item not found for ID=' + $routeParams.itemId;
                }
                else {
                    $scope.message = 'Failed to load ID=' + $routeParams.itemId + ' (status=' + response.status + ')';
                }
            }
        );
    }])
    .controller('MapSearchCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.fields = ['title', 'summary', 'distributionLinks', 'webLinks', 'previewImage', 'spatial'];
        SearchService.facets = ['browseCategory', 'browseType', 'partyWithName', 'tagType','tagScheme', 'tagNameForTypeAndScheme'];

        SearchService.searchParams.offset = 0;
        delete SearchService.searchParams.browseCategory;

        $scope.items = [];
        $scope.itemsTotal = 0;
        $scope.searchFacets = [];
        $scope.busy = false;
        $scope.filterCount = 0;

        $scope.$on('new_items', function () {
            $scope.items = $scope.items.concat(SearchService.items);
            $scope.itemsTotal = SearchService.itemsTotal;
            $scope.searchFacets = SearchService.searchFacets;
            $scope.busy = false;
            $scope.filterCount = SearchService.filterCount();
            $scope.filters = SearchService.filters;
        });

        $scope.$on('clear_items', function () {
            $scope.items = [];
        });

        // Infinite scroll
        $scope.nextPage = function () {
            if ($scope.busy) return;
            $scope.busy = true;
            SearchService.searchParams.offset += 20;
            SearchService.search();
        };
    }]);


var dummySlides = [
    {image:"../img/slides/ClimateChange.png", title:"", text:""},
    {image:"../img/slides/DataToolsTechnology.png", title:"", text:""},
    {image:"../img/slides/EarthCharacteristics.png", title:"", text:""},
    {image:"../img/slides/EcologyEnvironment.png", title:"", text:""},
    {image:"../img/slides/EnergyMinerals.png", title:"", text:""},
    {image:"../img/slides/EnvironmentalIssues.png", title:"", text:""},
    {image:"../img/slides/GeographicAnalysisMapping.png", title:"", text:""},
    {image:"../img/slides/GeologicalProcesses.png", title:"", text:""},
    {image:"../img/slides/HydrologicalProcesses.png", title:"", text:""},
    {image:"../img/slides/MappingRemoteSensingGeospatialData.png", title:"", text:""},
    {image:"../img/slides/NaturalHazards.png", title:"", text:""},
    {image:"../img/slides/OceansCoastlines.png", title:"", text:""},
    {image:"../img/slides/PlanetaryScience.png", title:"", text:""},
    {image:"../img/slides/Planets.png", title:"", text:""},
    {image:"../img/slides/PlantsAnimals.png", title:"", text:""},
    {image:"../img/slides/TechniquesMethods.png", title:"", text:""},
    {image:"../img/slides/Water.png", title:"", text:""},
    {image:"../img/slides/WaterResources.png", title:"", text:""}
];

}());