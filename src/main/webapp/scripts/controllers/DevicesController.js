'use strict';

angular.module('samanthaApp')
    .controller('DevicesCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$location',
        function ($scope, $rootScope, vertxEventBusService, $location) {

            $scope.devices = [
                {
                    imei: 123344,
                    brand: "Google",
                    model: "Nexus 5",
                    resolution: "1920x1080",
                    api: "20",
                    version: "Android L",
                    connected: false
                },
                {
                    imei: 123345,
                    brand: "HTC",
                    model: "One",
                    resolution: "1920x1080",
                    api: "19",
                    version: "Android 4.4",
                    connected: true
                },
                {
                    imei: 123346,
                    brand: "Samsung",
                    model: "Galaxy S3",
                    resolution: "1920x1080",
                    api: "17",
                    version: "Android 4.2.2",
                    connected: false
                },
                {
                    imei: 123347,
                    brand: "Google",
                    model: "Nexus 4",
                    resolution: "1920x1080",
                    api: "19",
                    version: "Android 4.4",
                    connected: false
                },
                {
                    imei: 123348,
                    brand: "Motorola",
                    model: "Moto X",
                    resolution: "1920x1080",
                    api: "19",
                    version: "Android 4.4",
                    connected: false
                },
                {
                    imei: 123349,
                    brand: "Samsung",
                    model: "Galaxy S4",
                    resolution: "1920x1080",
                    api: "19",
                    version: "Android 4.2.2",
                    connected: false
                }
            ]

            $scope.showApps = function(device){
                $location.path( "device/"+device.imei+"/apps" );
            }

        }]);
