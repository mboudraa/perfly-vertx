'use strict';

angular.module('samanthaApp', [
    'ng-polymer-elements',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'knalli.angular-vertxbus',
    'truncate',
    'LocalStorageModule',
    'monospaced.qrcode',
    'highcharts-ng',
    'ui.utils'
])
    .config(function ($routeProvider, $locationProvider, vertxEventBusProvider, localStorageServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/devices.html',
                controller: 'DevicesCtrl'
            })
            .when('/:deviceId/apps', {
                templateUrl: 'partials/applications.html',
                controller: 'ApplicationsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        vertxEventBusProvider
            .useReconnect()
            .useUrlServer('http://localhost:8080');


        localStorageServiceProvider.setPrefix("samantha");
        //$locationProvider.html5Mode(true);
    });