'use strict';

angular.module('samanthaApp')
    .controller('DevicesCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$location',
        function ($scope, $rootScope, vertxEventBusService, $location) {

            var ids = [];
            $scope.devices = [];

            $scope.showApps = function (device) {
                $location.path(device.id + "/apps");
            }

            vertxEventBusService.on('device.connect', function (device) {
                addDevice(device);
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                removeDevice(device);
            });

            $scope.$on('vertx-eventbus.system.connected', function () {
                $scope.retrieveDevices();
            });

            $scope.retrieveDevices = function() {
                vertxEventBusService.send('vertx.devices.get', null, true).then(function (reply) {
                    _(reply).each(function(device){
                        addDevice(device);
                    });
                });
            };

            function addDevice(device) {
                if(!device){
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


            function removeDevice(device){
                if(!device){
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
