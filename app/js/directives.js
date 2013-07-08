(function () {

'use strict';

/* Directives */


angular.module('explorer.directives', [])
    .directive('appInfo', ['appInfo', function (version) {
        return function(scope, elm, attrs) {
        elm.text(version);
        };
    }])
    .directive('facet', [function() {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'template/facet.html',
            link: function($scope, $element, attrs) {
                //console.log($scope);
            }
        };
    }])
    .directive('facetEntry', ['SearchService', function (SearchService) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: 'template/facetEntry.html',
            // scope: {
                // entryTerm: '=',
                // entryCount: '='
            // },
            link: function($scope, $element, attrs) {
                $scope.applyFilter = function() {
                    if ($scope.$parent.facet && $scope.entry.term) {
                        SearchService.applyFilter($scope.$parent.facet, $scope.entry.term);
                    }
                };
            }
        };
    }])
    .directive('filter', ['SearchService', function (SearchService) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: 'template/filter.html',
            link: function($scope, $element, attrs) {
                $scope.removeFilter = function() {
                    SearchService.removeFilter($scope.filter.key, $scope.filter.val);
                };
            }
        };
    }])
    .directive('item', ['ImageUtilService', function (ImageUtilService) {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            templateUrl: 'template/item.html',
            link: function($scope, $element, attrs) {
                //console.log($scope.item.id, $scope.item.$$hashKey);

                $scope.grabBrowseImageUri = function() {
                    var browseImageUri;
                    //console.log("grabBrowseImageUri", $scope.item.id, $scope.item.$$hashKey);
                    if ($scope.item.previewImage){
                        if ($scope.item.previewImage.small && $scope.item.previewImage.small.uri){
                            browseImageUri = $scope.item.previewImage.small.uri;
                        }
                    }
                    else if ($scope.item.webLinks) {
                        var found = false;
                        for (var i = 0; (!found && i < $scope.item.webLinks.length); i++) {
                            var webLink = $scope.item.webLinks[i];
                            if (webLink.type && webLink.type === 'browseImage') {
                                found = true;
                                if (jQuery.inArray(webLink.uri, ImageUtilService.galleryImageBlackList) === -1){
                                    browseImageUri = webLink.uri;
                                }
                            }
                        }
                    }
                    return browseImageUri;
                };

                $scope.item.browseImageUri = $scope.item.browseImageUri !== undefined ? $scope.item.browseImage : $scope.grabBrowseImageUri();
            }
        };
    }]);

}());
