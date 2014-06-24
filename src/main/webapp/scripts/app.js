'use strict';

angular.module('samanthaApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'knalli.angular-vertxbus',
    'truncate',
    'LocalStorageModule'
])
    .config(function ($routeProvider, $locationProvider, vertxEventBusProvider, localStorageServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        vertxEventBusProvider
            .useReconnect()
            .useUrlServer('http://localhost:8080');


        localStorageServiceProvider.setPrefix("samantha");
        $locationProvider.html5Mode(true);
    });