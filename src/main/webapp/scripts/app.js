'use strict';

var samantha = angular.module('perfly', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'knalli.angular-vertxbus',
    'truncate',
    'LocalStorageModule',
    'monospaced.qrcode',
    'highcharts-ng',
    'ui.utils',
    'timer',
    'ngMaterial'
])
    .config(function ($routeProvider, $locationProvider, vertxEventBusProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/devices.html',
                controller: 'DevicesCtrl'
            })
            .when('/:deviceId/apps', {
                templateUrl: 'partials/applications.html',
                controller: 'ApplicationsCtrl',
                reloadOnSearch: false
            })
            .otherwise({
                redirectTo: '/'
            });

        vertxEventBusProvider
            .useReconnect()
            .useUrlServer('http://localhost:8080');

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        (function (H) {
            function symbolWrap(proceed, symbol, x, y, w, h, options) {
                if (symbol.indexOf('text:') === 0) {
                    var text = symbol.split(':')[1],
                        svgElem = this.text(text, x, y + h)
                            .css({
                                fontFamily: 'FontAwesome',
                                fontSize: h * 2
                            });

                    if (svgElem.renderer.isVML) {
                        svgElem.fillSetter = function (value, key, element) {
                            element.style.color = H.Color(value).get('rgb');
                        };
                    }
                    return svgElem;
                }
                return proceed.apply(this, [].slice.call(arguments, 1));
            }
            H.wrap(H.SVGRenderer.prototype, 'symbol', symbolWrap);
            if (H.VMLRenderer) {
                H.wrap(H.VMLRenderer.prototype, 'symbol', symbolWrap);
            }

            // Load the font for SVG files also
            H.wrap(H.Chart.prototype, 'getSVG', function (proceed) {
                var svg = proceed.call(this);
                svg = '<?xml-stylesheet type="text/css" ' +
                'href="http://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" ?>' + svg;
                return svg;
            });
        }(Highcharts));

        //localStorageServiceProvider.setPrefix("samantha");
        //$locationProvider.html5Mode(true);
    });
