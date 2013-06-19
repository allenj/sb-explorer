'use strict';

/* Directives */


angular.module('explorer.directives', [])
    .directive('appInfo', ['appInfo', function (version) {
        return function(scope, elm, attrs) {
        elm.text(version);
        };
    }])
    .directive('facet', ['SearchService', function(SearchService) {
        return {
            restrict: 'E',
            controller: function($scope, $element, $attrs, $transclude, SearchService) {
                console.log("facet added?");
            }
        };
    }]);
