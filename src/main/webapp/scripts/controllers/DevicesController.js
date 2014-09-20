'use strict';

angular.module('perfly')
    .controller('DevicesCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$location', '$http', '$materialDialog', '$route',
        function ($scope, $rootScope, vertxEventBusService, $location, $http, $materialDialog, $route) {

            var ids = [];
            $scope.settingsDialogOpened = false;
            $scope.devices = [];

            $scope.showApps = function (device) {
                $location.path(device.id + "/apps");
            }

            vertxEventBusService.on('device.connect', function (device) {
                addDevice(device);
                if ($scope.devices.length == 1) {
                    $scope.showApps(device);
                }
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                removeDevice(device);
                showDialogIfNoDevice()
            });

            $scope.$on('vertx-eventbus.system.connected', function (event, args) {
                $scope.retrieveDevices();
            });

            $scope.retrieveDevices = function () {
                vertxEventBusService.send('vertx.devices.get', null).then(function (reply) {
                    _(reply).each(function (device) {
                        addDevice(device);
                    });
                    showDialogIfNoDevice();
                });
            };

            $scope.openSettingsDialog = function ($event) {
                var devicesLength = $scope.devices.length;
                $materialDialog({
                    clickOutsideToClose: devicesLength > 0,
                    escapeToClose: devicesLength > 0,
                    targetEvent: $event,
                    locals: {
                        devicesLength: devicesLength
                    },
                    templateUrl: '../../partials/template/settingsDialog.html',
                    controller: ['$scope', '$hideDialog', '$http', 'vertxEventBusService', 'devicesLength',
                        function ($scope, $hideDialog, $http, vertxEventBusService, devicesLength) {
                            $scope.devicesLength = devicesLength;
                            $http.get('/config').success(function (data) {
                                $scope.baseUrl = data.ip;
                            });

                            $scope.close = function () {
                                $hideDialog();
                            };

                            vertxEventBusService.on('device.connect', function (device) {
                                $scope.close();
                            });
                        }]
                });
            };


            function showDialogIfNoDevice() {
                if ($scope.devices.length == 0 && $location.path() == '/') {
                    $scope.openSettingsDialog();
                }
            }

            function addDevice(device) {
                if (!device) {
                    return;
                }

                var index = ids.indexOf(device.id);
                if (index != -1) {
                    $scope.devices.splice(index, 1, device);
                } else {
                    ids.push(device.id)
                    $scope.devices.push(device);
                }
            }


            function removeDevice(device) {
                if (!device) {
                    return;
                }

                var index = ids.indexOf(device.id);
                if (index != -1) {
                    $scope.devices.splice(index, 1);
                }
            }

            if (vertxEventBusService.readyState() === 1) {
                $scope.retrieveDevices();
            }

        }]);
;
