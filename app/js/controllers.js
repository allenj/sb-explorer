'use strict';


var COLLECTIONS_PARENT_ID = "5137a368e4b066106b2eb640";
// var COLLECTIONS_PARENT_ID = "4f3559d2da0661d9ec041a0a";
/* Controllers */

angular.module('explorer.controllers', [])
    .controller('CollectionsCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        SearchService.setPlaceHolder('Search Data Collections');
        SearchService.searchParams['parentId'] = COLLECTIONS_PARENT_ID;
        SearchService.searchParams['offset'] = 0;
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
            SearchService.searchParams['offset'] = 0;
            SearchService.search($scope.q);
        };

        $scope.$on('clear_search', function() {
            $scope.q = '';
        });
    }])
    .controller('SearchCtrl', [ '$scope', '$routeParams', '$location', 'SearchService', '$rootScope', function ($scope, $routeParams, $location, SearchService, $rootScope) {
        SearchService.setPlaceHolder('Search Data');
        SearchService.fields = ['title', 'summary', 'distributionLinks', 'webLinks','previewImage'];
        SearchService.facets = ['browseCategory', 'browseType', 'partyWithName', 'facets.facetName', 'tagNameForTypeAndScheme'];
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
            SearchService.searchParams['offset'] += 20;
            SearchService.search();
        };
    }])
    .controller('SlidesCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        $scope.slides = [];
        $scope.carouselInterval = 5000; //-1
        $scope.grabSlideImageUri = sbItemUtils.grabGalleryImageUri;

        $scope.$on('new_items', function () {
            $.each(SearchService.items, function (index, item) {
                var ImageUri = $scope.grabSlideImageUri(item);
                if (ImageUri) {
                    $scope.slides.push({image:ImageUri, title:item.title, text:item.summary, itemLink: item.link.url})
                }
            });
        });
    }])
    .controller('DummySlidesCtrl', [ '$scope', 'SearchService', function ($scope, SearchService) {
        $scope.slides = dummySlides;
        $scope.carouselInterval = 5000;
    }]);


var sbItemUtils = {

    grabGalleryImageUri: function(item) {
        var galleryImageUri;
        //console.log (item.previewImage);
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
                var webLink = item.webLinks[i]
                if (webLink.type && webLink.type == 'browseImage') {
                    found = true;
                    if (jQuery.inArray(webLink.uri, browseImageBlackList) == -1){
                        galleryImageUri = webLink.uri;
                    }
                }
            }
        }

        if (jQuery.inArray(galleryImageUri, galleryImageBlackList) >= 0){
            galleryImageUri = null;
        }

        return galleryImageUri;
    }
};


var galleryImageBlackList =
    ['http://pubs.er.usgs.gov/thumbnails/usgs_thumb.jpg',
        'http://pubs.er.usgs.gov/thumbnails/outside_thumb.jpg']

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

