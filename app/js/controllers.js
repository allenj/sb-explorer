(function () {

'use strict';


var COLLECTIONS_PARENT_ID = "5137a368e4b066106b2eb640";
// var COLLECTIONS_PARENT_ID = "4f3559d2da0661d9ec041a0a";
/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.setPlaceHolder('Search Data Collections');
        SearchService.searchParams.parentId = COLLECTIONS_PARENT_ID;
        SearchService.searchParams.offset = 0;
        SearchService.filters = [];
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
    .controller('NavCtrl', [ '$scope', '$rootScope', 'SearchService', function ($scope, $rootScope, SearchService) {
        $scope.doSearch = function() {
            $rootScope.$broadcast('clear_items');
            SearchService.searchParams.offset = 0;
            SearchService.search($scope.q);
        };

        $scope.$on('clear_search', function() {
            $scope.q = '';
        });
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'SearchService', '$rootScope', function ($scope, $routeParams, $location, SearchService, $rootScope) {
        SearchService.setPlaceHolder('Search Data');
        SearchService.fields = ['title', 'summary', 'distributionLinks', 'webLinks','previewImage'];
        SearchService.facets = ['browseCategory', 'browseType', 'partyWithName', 'facets.facetName', 'tagType','tagScheme', 'tagNameForTypeAndScheme'];
        SearchService.filters = [{key: 'ancestors', val: $routeParams.parentId}];
        SearchService.searchParams = {offset: 0};

        $scope.items = [];
        $scope.itemsTotal = 0;
        $scope.searchFacets = [];
        $scope.busy = false;
        $scope.filterCount = 0;
        $scope.queryParams = $.param($location.search());

        $scope.$on('new_items', function() {
            $scope.items = $scope.items.concat(SearchService.items);
            $scope.itemsTotal = SearchService.itemsTotal;
            $scope.searchFacets = SearchService.searchFacets;
            $scope.busy = false;
            $scope.filterCount = SearchService.filterCount();
            $scope.filters = SearchService.filters;
        });

        $scope.$on('clear_items', function() {
            $scope.items = [];
        });

        $rootScope.$broadcast('clear_search');
        SearchService.search();

        // Infinite scroll
        $scope.nextPage = function() {
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

        $scope.$on('clear_items', function() {
            $scope.slides = [];
        });

    }])
    .controller('DummySlidesCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        $scope.slides = dummySlides;
        $scope.carouselInterval = 5000;
    }]);


var dummySlides = [
    {image:"img/slides/ClimateChange.png", title:"", text:""},
    {image:"img/slides/DataToolsTechnology.png", title:"", text:""},
    {image:"img/slides/EarthCharacteristics.png", title:"", text:""},
    {image:"img/slides/EcologyEnvironment.png", title:"", text:""},
    {image:"img/slides/EnergyMinerals.png", title:"", text:""},
    {image:"img/slides/EnvironmentalIssues.png", title:"", text:""},
    {image:"img/slides/GeographicAnalysisMapping.png", title:"", text:""},
    {image:"img/slides/GeologicalProcesses.png", title:"", text:""},
    {image:"img/slides/HydrologicalProcesses.png", title:"", text:""},
    {image:"img/slides/MappingRemoteSensingGeospatialData.png", title:"", text:""},
    {image:"img/slides/NaturalHazards.png", title:"", text:""},
    {image:"img/slides/OceansCoastlines.png", title:"", text:""},
    {image:"img/slides/PlanetaryScience.png", title:"", text:""},
    {image:"img/slides/Planets.png", title:"", text:""},
    {image:"img/slides/PlantsAnimals.png", title:"", text:""},
    {image:"img/slides/TechniquesMethods.png", title:"", text:""},
    {image:"img/slides/Water.png", title:"", text:""},
    {image:"img/slides/WaterResources.png", title:"", text:""}
];

}());