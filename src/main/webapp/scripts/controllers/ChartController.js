'use strict';

angular.module('samanthaApp')
    .controller('ChartCtrl', ['$scope', 'vertxEventBusService', '$routeParams', '$location', '$timeout', '$http', 'ChartService',
        function ($scope, vertxEventBusService, $routeParams, $location, $timeout, $http, ChartService) {

            $scope.applicationStatus = {pid: '', state: ''};
            $scope.ChartSelection = {
                memory: true, 
                cpu: false
            };

            $scope.$watch('ChartSelection', function(newValue, oldValue) {
                if (!newValue.memory && !newValue.cpu) {
                    newValue.memory = oldValue.cpu == true;
                    newValue.cpu = oldValue.memory == true;
                }
            }, true);

            $scope.resetZoom = function() {
                ChartService.zoomAllChartsOut();
            };

            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on(deviceId + '/android.monitoring.progress/status', function (message) {
                var sysdump = message.data;
                if (!angular.isUndefined(sysdump.applicationStatus)) {
                    $scope.applicationStatus.pid = sysdump.applicationStatus.pid;
                    $scope.applicationStatus.state = sysdump.applicationStatus.state;
                }                
            });

            vertxEventBusService.on('vertx.monitoring.start', function (message) {
                if (message.deviceId === deviceId) {
                    ChartService.startUpdatingCharts();
                    ChartService.startUpdatingMasterChart();       
                }                             
            });

            vertxEventBusService.on('vertx.monitoring.stop', function (message) {
                if (message.deviceId === deviceId) {
                    ChartService.stopUpdatingCharts();   
                    ChartService.stopUpdatingMasterChart();    
                }                             
            });
            
        }]);
