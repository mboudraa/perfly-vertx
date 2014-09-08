'use strict';

angular.module('samanthaApp')
    .controller('ProgressDialogCtrl', ['$scope', 'vertxEventBusService', '$routeParams', '$location', '$timeout',
        function ($scope, vertxEventBusService, $routeParams, $location, $timeout) {
            var counter = 15;
            $scope.countdown = counter;
            $scope.opened = false;
            var mytimeout;
            var deviceId = $routeParams['deviceId'];

            var startCountDown = function () {
                $scope.countdown = counter;
                mytimeout = $timeout(startCountDown, 1000);
                counter--;
                if (counter < 0) {
                    $scope.opened = false;
                    $timeout.cancel(mytimeout);
                    $location.path('/');
                }

            }

            vertxEventBusService.on('device.connect', function (device) {
                if (deviceId == device.id) {
                    $scope.opened = false;
                    $timeout.cancel(mytimeout);
                }
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                if (deviceId == device.id) {
                    $scope.opened = true;
                    startCountDown();
                }
            });
        }]);
