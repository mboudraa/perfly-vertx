'use strict';

angular.module('samanthaApp')
    .controller('ApplicationsCtrl', ['$scope', '$rootScope', 'vertxEventBusService', 'localStorageService', '$location',
        function ($scope, $rootScope, vertxEventBusService, localStorageService, $location) {

            $scope.applications = [];
            $scope.qrCodeData = $location.host();

            var appList = localStorageService.get("appList");

            vertxEventBusService.on('vertx.app.post', function (application) {
                $scope.applications.push(application);

                appList = localStorageService.get("appList");

                if (!appList) {
                    appList = [];
                }

                appList.push(application);
                localStorageService.set("appList", appList);
            });


            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                console.log(sysdump);
            });


            $scope.startApplication = function (application) {
                vertxEventBusService.send("vertx");
                vertxEventBusService.send("vertx.app.start", {packageName: application.packageName})
            }

            function retrieveApplications() {
                if (localStorageService.isSupported && appList) {
                    $scope.applications = appList;
                } else {
                    localStorageService.remove(appList);
                    vertxEventBusService.send("vertx.apps.get", {message: ""});
                }
            }


            retrieveApplications();

        }]);
