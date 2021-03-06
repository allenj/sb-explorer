angular.module("explorer.tmpls", ["template/facetEntry.html", "template/facet.html", "template/filter.html", "template/item.html", "template/slides.html"]);

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
        "<div ng-show=\"facet.total\">" +
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
            "<a href=\"#/item/{{item.id}}\"><h4 class=\"media-heading\">{{item.title}}</h4></a>" +
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


                "<a class=\"label label-info dist-link\" ng-repeat=\"webLink in item.webLinks\" href=\"{{webLink.uri}}\">" +
                "{{webLink.title}}" +
                "</a>" +

            "</div>" +
        "</div>"
    );
}]);

angular.module("template/slides.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/slides.html",
        "<div class=\"span12\" id=\"itemCarouselContainer\">" +
            "<carousel interval=\"carouselInterval\">" +
                "<slide ng-repeat=\"slide in slides\" active=\"slide.active\">" +
                    "<a href=\"{{slide.itemLink}}\">" +
                        "<img ng-src=\"{{slide.image}}\" style=\"margin:auto;\">" +
                    "</a>" +
                    "<div class=\"carousel-caption\">" +
                        "<a href=\"{{slide.itemLink}}\">" +
                            "<h4 style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\" title=\"{{slide.title}}\">{{slide.title}}</h4>" +
                            "<p>{{slide.text}}</p>" +
                        "</a>" +
                    "</div>" +
              "</slide>" +
            "</carousel>" +
        "</div>"
    );
}]);

angular.module("template/map.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/map.html",
        "<div class=\"container\">" +
            "<div class=\"row\">" +
                "<div class=\"span9\">" +
                    "<leaflet center=\"center\" height=\"480px\" width=\"960px\" zoom=\"3\" lat=\"39.50\" lng=\"-95.35\"></leaflet>" +
                "</div>" +
            "</div>" +
        "</div>"
    );
}]);
