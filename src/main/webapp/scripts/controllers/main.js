'use strict';

angular.module('samanthaApp')
    .controller('MainCtrl', ['$scope', 'vertxEventBusService', function ($scope, vertxEventBusService) {

        $scope.applications = [];

        vertxEventBusService.on('android.application', function (message) {
            $scope.applications.push(JSON.parse(message));
        });
    }]);
