'use strict';

angular.module('samanthaApp')
    .controller('ApplicationsCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams',
        function ($scope, $rootScope, vertxEventBusService, $routeParams) {

            $scope.ctrl = {
                tabSelected: 0,
                monitoredApplication: undefined,
                currentApplication: undefined,
                fabIcon: 'arrow-forward'
            };
            $scope.applications = [];
            $scope.search = '';
            $scope.openSearch = false;
            $scope.updateCurrentApplication = function(application) {
                $scope.ctrl.currentApplication = application;
            }
            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on('vertx.app.post', function (application) {
                $scope.applications.push(application);
            });

            $scope.fabAction = function () {
                if ($scope.ctrl.tabSelected == 1) {
                    // Stop
                } else {
                    $scope.startApplication($scope.ctrl.currentApplication)
                }
            }
            $scope.startApplication = function(application) {
                $scope.ctrl.monitoredApplication = application;
                $scope.ctrl.tabSelected = 1;
                vertxEventBusService.publish("vertx.app.start", {deviceId: deviceId, packageName: application.packageName})
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
            $scope.searchComparator = function (app) {
                if (!app) {
                    return false;
                }
                if (!$scope.search || $scope.search === '' || $scope.search.length <= 2) {
                    return true;
                }
                return (app.label.toLowerCase().indexOf($scope.search.toLowerCase()) > -1) || (app.packageName.toLowerCase().indexOf($scope.search.toLowerCase()) > -1);
            }
            $scope.$watch("ctrl", function(id) {
                if (id.tabSelected == 0) {
                    $scope.ctrl.fabIcon = "arrow-forward";
                } else {
                    $scope.ctrl.fabIcon = "arrow-back";
                }
            }, true);
        }]);
