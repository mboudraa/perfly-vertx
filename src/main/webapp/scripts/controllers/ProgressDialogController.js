'use strict';

angular.module('perfly')
    .controller('ProgressDialogCtrl', ['$scope', 'vertxEventBusService', '$routeParams',
        function ($scope, vertxEventBusService, $routeParams) {

            var deviceId = $routeParams['deviceId'];

            $scope.progressDialog = {
                loading: false,
                title: "Waiting for Device...",
                total: 0,
                progress: 0,
                appName: '',
                opened: true
            };

            vertxEventBusService.on(deviceId + '/android.apps.start', function (response) {
                $scope.progressDialog.total = response.data.total;
                $scope.progressDialog.title = "Getting List of Installed Apps...";
                $scope.progressDialog.loading = true;
            });


            vertxEventBusService.on(deviceId + '/android.apps.progress', function (response) {
                $scope.progressDialog.progress = response.data.progress;
                $scope.progressDialog.appName = response.data.application.label
            });

            vertxEventBusService.on(deviceId + '/android.apps.finish', function () {
                $scope.progressDialog.open = false;
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                if (deviceId == device.id) {
                    $scope.progressDialog.open = false;
                }
            });

        }]);
