'use strict';

angular.module('samanthaApp')
    .controller('ApplicationsCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams',
        function ($scope, $rootScope, vertxEventBusService, $routeParams) {

            $scope.applications = [];
            $scope.currentApplication;
            $scope.search = '';
            $scope.openSearch = false;
            $scope.updateCurrentApplication = function(application) {
                $scope.currentApplication = application;
            }
            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on('vertx.app.post', function (application) {
                $scope.applications.push(application);
            });

            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                console.log(sysdump);
            });

            $scope.startApplication = function (application) {
                vertxEventBusService.send("vertx.app.start", {deviceId: deviceId, packageName: application.packageName})
            }

            $scope.$on('vertx-eventbus.system.connected', function () {
                $scope.retrieveApplications();
            });

            $scope.retrieveApplications = function(forceRefresh) {
                forceRefresh = forceRefresh ? forceRefresh : false;
                vertxEventBusService.send("vertx.apps.get", {deviceId: deviceId, forceRefresh: forceRefresh});
            }

            if (vertxEventBusService.readyState() === 1) {
                $scope.retrieveApplications();
            }
        }]);
