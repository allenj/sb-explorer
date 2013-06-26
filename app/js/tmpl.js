angular.module("explorer.tmpls", ["template/facetEntry.html", "template/facet.html", "template/filter.html"]);

angular.module("template/facetEntry.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/facetEntry.html",
        "<li>" +
            "<a title=\"{{entry.term|facetChars}}\" ng-click=\"applyFilter()\">" +
                "<i class=\"icon-plus hide pull-right\"></i>" +
                "{{entry.term|facetChars:16:false:entry.count}} ({{entry.count}})" +
            "</a>" +
        "</li>"
    );
}]);

angular.module("template/facet.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/facet.html",
        "<div>" +
            "<h5>{{facet.label}}</h5>" +
            "<ul class=\"nav nav-list\">" +
                "<facet-entry ng-repeat=\"entry in facet.entries\"></facet-entry>" +
                "<li ng-show=\"facet.other > 0 && facet.entries.length > 7\">" +
                    "<a href=\"#/collections/{{parentId}}?facetDetail={{facet.name}}&facetDetailSize=50\">" +
                        "<i ng-class=\"{true: 'active', false: 'inactive'}[isActive]\"></i>" +
                        "More" +
                    "</a>" +
                "</li>" +
            "</ul>" +
        "</div>"
    );
}]);

angular.module("template/filter.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/filter.html",
        "<li ng-show=\"filter.facetLabel != undefined\">" +
            "<a title=\"{{filter.facetLabel}}: {{filter.val}}\" ng-click=\"removeFilter()\">" +
                "<i class=\"icon-minus pull-right\"></i>" +
                "{{filter.facetLabel}}: {{filter.val|facetChars:17:false:filter.facetLabel}}" +
            "</a>" +
        "</li>"
    );
}]);
