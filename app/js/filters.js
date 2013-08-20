(function () {

'use strict';

/* Filters */

angular.module('explorer.filters', [])
    .filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter('facetChars', function() {
        return function(input, nChars, truncateOnWord, facetCount) {
            input = removeContactId(input);

            if (isNaN(nChars)) return input;
            if (nChars <= 0) return '';

            if (!facetCount) facetCount = 0;
            var facetCountLength = facetCount.toString().length;

            var maxLength = nChars + (3 - facetCountLength);

            if (input && input.length >= maxLength) {
                input = input.substring(0, maxLength);

                if (truncateOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }

                return input + "...";
            }
            return input;
        };
    })
    .filter('characters', function() {
        return function(input, nChars, truncateOnWord) {
            if (isNaN(nChars)) return input;
            if (nChars <= 0) return '';

            if (input && input.length >= nChars) {
                input = input.substring(0, nChars);

                if (truncateOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }

                return input + "...";
            }
            return input;
        };
    })
    .filter('words', function() {
        return function(input, nWords) {
            if (isNaN(nWords)) return input;
            if (nWords <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.splice(0, words).join(' ') + "...";
                }
            }
            return input;
        };
    });


function removeContactId(input) {
    if (/^\d+_\D/.test(input)) {
        return input.substr(input.indexOf('_') + 1);
    } else if (/^XX+_\D/.test(input)) {
        return input.substr(input.indexOf('_') + 1);
    }
    return input;
}

}());