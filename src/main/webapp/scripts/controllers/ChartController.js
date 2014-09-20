'use strict';

angular.module('perfly')
    .controller('ChartCtrl', ['$scope', 'vertxEventBusService', '$routeParams', '$location', 'ChartService', '$rootScope',
        function ($scope, vertxEventBusService, $routeParams, $location, ChartService, $rootScope) {

            $scope.applicationStatus = {pid: '', state: ''};
            $scope.ChartSelection = {
                memory: true,
                cpu: false
            };

            $scope.chartStatus = {
                zoomed: false
            };

            $rootScope.$on('chart.status', function (event, status) {
                $scope.chartStatus.zoomed = status.zoomed;
            });

            $scope.palette = {
                options: [
                    {
                        target: 'monitoring-container',
                        alpha: 0.1
                    },
                    {
                        target: 'toolbar-monitoring',
                        alpha: 1
                    }
                ]
            }

            $scope.$watch('ChartSelection', function (newValue, oldValue) {
                if (!newValue.memory && !newValue.cpu) {
                    newValue.memory = oldValue.cpu == true;
                    newValue.cpu = oldValue.memory == true;
                }
            }, true);


            $scope.resetZoom = function () {
                ChartService.resetZoom();
            };

            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on(deviceId + '/android.monitoring.progress/status', function (message) {
                var sysdump = message.data;
                if (!angular.isUndefined(sysdump.applicationStatus)) {
                    $scope.applicationStatus.pid = sysdump.applicationStatus.pid;
                    $scope.applicationStatus.state = sysdump.applicationStatus.state;
                }
            });


            vertxEventBusService.on("vertx.monitoring.start", function (data) {
                if (data.deviceId === deviceId) {
                    ChartService.resetCharts();
                    ChartService.startCharts();
                }
            });

            vertxEventBusService.on("vertx.monitoring.stop", function (data) {
                if (data.deviceId === deviceId) {
                    ChartService.stopCharts();
                }
            });


        }]);
