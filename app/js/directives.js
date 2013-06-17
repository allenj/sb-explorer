'use strict';

/* Directives */


angular.module('explorer.directives', [])
    .directive('appInfo', ['appInfo', function (version) {
        return function(scope, elm, attrs) {
        elm.text(version);
        };
    }]);
