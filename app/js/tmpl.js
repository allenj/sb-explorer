angular.module("explorer.tmpls", ["template/facetEntry.html", "template/facet.html", "template/filter.html", "template/item.html"]);

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
        "<li ng-show=\"filter.filterLabel != undefined\">" +
            "<a title=\"{{filter.filterLabel}}: {{filter.val}}\" ng-click=\"removeFilter()\">" +
                "<i class=\"icon-minus pull-right\"></i>" +
                "{{filter.filterLabel}}: {{filter.val|facetChars:17:false:filter.filterLabel}}" +
            "</a>" +
        "</li>"
    );
}]);

angular.module("template/item.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/item.html",
        "<div class=\"sb-item shadowbox media\" style=\"zoom:1;\">" +
            "<a href=\"{{item.link.url}}\"><h4 class=\"media-heading\">{{item.title}}</h4></a>" +
            "<img class=\"pull-left\" ng-src=\"{{item.browseImageUri}}\" style=\"max-height: 200px; max-width: 100px;\" />" +
            "<div class=\"media-body\">" +
                "<p>{{item.summary}}</p>" +
                "<a class=\"label label-info dist-link\" ng-repeat=\"distLink in item.distributionLinks\" href=\"{{distLink.uri}}\">" +
                    "{{distLink.title}}" +
                "</a>" +
                "<span ng-show=\"item.previewImage.original\">" +
                "<a ng-show=\"item.previewImage.small.uri\" class=\"label label-info dist-link\" href=\"{{item.previewImage.small.uri}}\">Small Image</a>" +
                "<a ng-show=\"item.previewImage.medium.uri\" class=\"label label-info dist-link\" href=\"{{item.previewImage.medium.uri}}\">Medium Image</a>" +
                "<a ng-show=\"item.previewImage.large.uri\"class=\"label label-info dist-link\" href=\"{{item.previewImage.large.uri}}\">Large Image</a>" +
                "<a ng-show=\"item.previewImage.original.uri\"class=\"label label-info dist-link\" href=\"{{item.previewImage.original.viewUri}}\">Full Image</a>" +
                "</span>" +
            "</div>" +
        "</div>"
    );
}]);

