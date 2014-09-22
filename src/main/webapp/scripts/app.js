/*
 * Copyright (c) 2014 Mounir Boudraa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var perfly = angular.module('perfly', [
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
            .enable()
            .useReconnect();

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
