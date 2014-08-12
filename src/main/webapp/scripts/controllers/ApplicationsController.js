'use strict';

angular.module('samanthaApp')
    .controller('ApplicationsCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams',
        function ($scope, $rootScope, vertxEventBusService, $routeParams) {

            $scope.applications = [];
            var appList = [];

            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on('vertx.app.post', function (application) {
                $scope.applications.push(application);
                appList.push(application);
            });

            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                console.log(sysdump);
            });


            $scope.startApplication = function (application) {
                vertxEventBusService.send("vertx.app.start", {deviceId: deviceId, packageName: application.packageName})
            }

            function retrieveApplications() {
                vertxEventBusService.send("vertx.apps.get", {deviceId: deviceId});
            }


            retrieveApplications();

        }]);
