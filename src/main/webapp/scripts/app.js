'use strict';

angular.module('samanthaApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'knalli.angular-vertxbus',
    'truncate',
    'LocalStorageModule',
    'monospaced.qrcode'
])
    .config(function ($routeProvider, $locationProvider, vertxEventBusProvider, localStorageServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/devices.html',
                controller: 'DevicesCtrl'
            })
            .when('/device/:deviceId/apps', {
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