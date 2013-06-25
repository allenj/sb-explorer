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
    }]);
