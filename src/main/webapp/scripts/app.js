'use strict';

angular.module('samanthaApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'knalli.angular-vertxbus',
    'truncate'
])
    .config(function ($routeProvider, $locationProvider, vertxEventBusProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        vertxEventBusProvider
            .enable()
            .useReconnect()
            .useUrlServer('http://localhost:8080')
            .useUrlPath("/eventbus")

        $locationProvider.html5Mode(true);
    });