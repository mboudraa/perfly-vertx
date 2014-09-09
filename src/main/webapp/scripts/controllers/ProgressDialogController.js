'use strict';

angular.module('samanthaApp')
    .controller('ProgressDialogCtrl', ['$scope', 'vertxEventBusService', '$routeParams',
        function ($scope, vertxEventBusService, $routeParams) {

            var deviceId = $routeParams['deviceId'];

            $scope.ctrl = {
                loading: false,
                title: "Waiting for Device...",
                total: 0,
                progress: 0,
                appName: '',
                progressDialogOpened: true
            };

            vertxEventBusService.on(deviceId + '/android.apps.start', function (response) {
                $scope.ctrl.total = response.data.total;
                $scope.ctrl.title = "Getting List of Installed Apps...";
                $scope.ctrl.loading = true;
            });


            vertxEventBusService.on(deviceId + '/android.apps.progress', function (response) {
                $scope.ctrl.progress = response.data.progress;
                $scope.ctrl.appName = response.data.application.label
            });

            vertxEventBusService.on(deviceId + '/android.apps.finish', function () {
                $scope.ctrl.progressDialogOpened = false;
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                if (deviceId == device.id) {
                    $scope.ctrl.progressDialogOpened = false;
                }
            });

        }]);
