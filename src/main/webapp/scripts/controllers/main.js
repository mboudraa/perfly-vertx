'use strict';

angular.module('samanthaApp')
    .controller('MainCtrl', ['$scope', 'vertxEventBusService', function ($scope, vertxEventBusService) {

        $scope.applications = [];

        vertxEventBusService.on('browser.app.post', function (message) {
            $scope.applications.push(JSON.parse(JSON.parse(message)));
        });
    }]);
