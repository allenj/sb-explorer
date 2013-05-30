'use strict';

/* Directives */


angular.module('explorer.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
        elm.text(version);
        };
    }])
    .directive('bs-affix', [function() {
        return function (scope, elm, attrs) {
            $(elm).affix();
        };
    }]);
