(function () {
'use strict';

angular.module('explorer.leaflet-directive', [])
    .directive('leaflet', ['SearchService', '$parse', function(SearchService, $parse) {

        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            scope: {
                center: '=center',
                maxZoom: '=maxZoom',
                zoom: '=zoom',
                lat: '=lat',
                lng: '=lng'
            },
            template: '<div class="angular-leaflet-map"></div>',
            link: function($scope, $element, attrs) {
                setElementCssDimensions();
                $scope.leaflet = {};
                $scope.leaflet.map = createMapWithControls();

                function setElementCssDimensions() {
                    if (attrs.width) {
                        $element.css('width', attrs.width);
                    }
                    if (attrs.height) {
                        $element.css('height', attrs.height);
                    }
                };

                function getBackgroundLayer(mapServerUrl, attribution) {
                    return new L.TileLayer(mapServerUrl, {
                        maxZoom: 19,
                        attribution: attribution
                    });
                };

                function initMap(backgroundLayer) {
                    return new L.Map($element[0], {
                        maxZoom: 14,
                        minZoom: 1,
                        doubleClickZoom: true,
                        scrollWheelZoom: true,
                        layers: [backgroundLayer],
                        center: new L.LatLng($scope.lat, $scope.lng),
                        zoom: $scope.zoom
                    });
                };

                function getDrawControl(features) {
                    return new L.Control.Draw({
                        position: 'topright',
                        draw: {
                            polyline: false,
                            polygon: true,
                            circle: false,
                            marker: false
                        },
                        edit: {
                            featureGroup: features
                        }
                    });
                };

                function createMapWithControls() {
                    var backgroundLayer = getBackgroundLayer(
                        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                        "<a href='http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer'>ESRI ArcGIS World Topo Map</a>"
                    );

                    var map = initMap(backgroundLayer);

                    var features = new L.FeatureGroup();
                    map.addLayer(features);
                    map.addControl(getDrawControl(features));

                    map.on('draw:created', function (e) {
                        var type = e.layerType;
                        var layer = e.layer;

                        if (type === 'rectangle') {
                            var coordinates = layer.toGeoJSON().geometry.coordinates[0];
                            var topLeft = coordinates[0];
                            var bottomRight = coordinates[2];
                            var facet = {
                                name: 'spatialQuery',
                                label: 'Spatial'
                            };
                            var query = {
                                type: 'envelope',
                                coordinates: [topLeft, bottomRight]
                            };
                            SearchService.applyFilter(facet, JSON.stringify(query));
                        }

                        features.addLayer(layer);
                    });

                    return map;
                };
            }
        };
    }]);
}());