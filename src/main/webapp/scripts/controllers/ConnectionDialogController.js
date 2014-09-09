'use strict';

angular.module('samanthaApp')
    .controller('ConnectionDialogCtrl', ['$scope', 'vertxEventBusService', '$routeParams', '$location', '$timeout',
        function ($scope, vertxEventBusService, $routeParams, $location, $timeout) {

            var COUNTDOWN = 5 * 60;
            $scope.countDown = COUNTDOWN;
            $scope.opened = false;
            $scope.endTime;
            var deviceId = $routeParams['deviceId'];


            $scope.onTimerFinished = function () {
                $scope.opened = false;
                $location.path('/');
            }

            vertxEventBusService.on('device.connect', function (device) {
                if (deviceId == device.id) {
                    $scope.opened = false;
                    $scope.$broadcast('timer-stop');
                    $scope.$broadcast('timer-set-countdown', COUNTDOWN);
                }
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                if (deviceId == device.id) {
                    $scope.opened = true;
                    $scope.$broadcast('timer-start');
                }
            });
        }]);
