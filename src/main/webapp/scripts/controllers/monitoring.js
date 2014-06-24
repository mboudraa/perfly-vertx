'use strict';

angular.module('samanthaApp')
    .controller('MonitoringCtrl', ['$scope', '$rootScope', 'vertxEventBusService',
        function ($scope, $rootScope, vertxEventBusService) {

            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                console.log(sysdump);
            });


        }]);
