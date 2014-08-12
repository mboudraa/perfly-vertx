'use strict';

angular.module('samanthaApp')
    .controller('DevicesCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$location',
        function ($scope, $rootScope, vertxEventBusService, $location) {

            var imeis = [];
            $scope.devices = [];

            $scope.showApps = function (device) {
                $location.path("device/" + device.imei + "/apps");
            }

            vertxEventBusService.on('device.connect', function (device) {
                addDevice(device);
            });

            vertxEventBusService.on('device.disconnect', function (device) {
                removeDevice(device);
            });


            $scope.$on('vertx-eventbus.system.connected', function () {
                vertxEventBusService.send('vertx.devices.get', null, true).then(function (reply) {
                    _(reply).each(function(device){
                        addDevice(device);
                    });
                });
            });



            function addDevice(device) {
                if(!device){
                    return;
                }

                var index = imeis.indexOf(device.imei);
                if (index != -1) {
                    $scope.devices.splice(index, 1, device);
                } else {
                    imeis.push(device.imei)
                    $scope.devices.push(device);
                }
            }
            function removeDevice(device){
                if(!device){
                    return;
                }

                var index = imeis.indexOf(device.imei);
                if (index != -1) {
                    $scope.devices.splice(index, 1, device);
                }
            }

        }])
;
