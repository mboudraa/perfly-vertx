'use strict';

angular.module('samanthaApp')
    .controller('MainCtrl', ['$scope', '$rootScope', 'vertxEventBusService', 'localStorageService',
        function ($scope, $rootScope, vertxEventBusService, localStorageService) {

            $scope.applications = [];
            var appList = localStorageService.get("appList");

            vertxEventBusService.on('vertx.app.post', function (application) {
                $scope.applications.push(application);

//                appList = localStorageService.get("appList");
//
//                if (!appList) {
//                    appList = [];
//                }
//
//                appList.push(application);
//                localStorageService.set("appList", appList);
            });


            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                console.log(sysdump);
            });

            $rootScope.$on("vertx-eventbus.system.connected", function () {
//                if (localStorageService.isSupported && appList) {
//                    $scope.applications = appList;
//                } else {
                    vertxEventBusService.send("vertx.apps.get", {message: ""});
//                }
            });

            $rootScope.$on("vertx-eventbus.system.disconnected", function () {

            });


            $scope.startApplication = function (application) {
                vertxEventBusService.send("vertx.app.start", {packageName: application.packageName})
            }


        }]);
