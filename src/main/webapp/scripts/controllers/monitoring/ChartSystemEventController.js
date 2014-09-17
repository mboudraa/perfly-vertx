'use strict';

angular.module('samanthaApp')
    .controller('ChartSystemEventCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, $rootScope, vertxEventBusService, $routeParams, ChartService) {

            var packageName;
            var axis = [];
            var deviceId = $routeParams['deviceId'];

            function resetSeries() {
                _.each( ChartService.SystemEventChartConfig.series, function (serie, i) {
                    serie.setData([], true);
                });
            };

            vertxEventBusService.on("vertx.monitoring.start", function (data) {
                if (data.deviceId == deviceId) {
                    packageName = data.packageName;
                    resetSeries();
                }
            });

            vertxEventBusService.on(deviceId + '/android.monitoring.progress/orientation', function (response) {
                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.orientation)) {
                    var orientationName = sysdump.orientation == 2 ? "landscape" : "portrait";

                    $scope.chartSystemEventConfig.options.xAxis.plotLines.push({
                        value: sysdump.time,
                        color: 'blue',
                        width: 1,                     
                        label: {
                            text: 'Orientation: ' + orientationName,
                            rotation: 90
                        }
                    });
                }
            });


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/status', function (response) {
                var sysdump = response.data;
                if (!angular.isUndefined(sysdump.applicationStatus)) {
                    $scope.chartSystemEventConfig.options.xAxis.plotLines.push({
                        value: sysdump.time,
                        color: 'green',
                        width: 1,                     
                        label: {
                            text: 'State: ' + sysdump.applicationStatus.state,
                            rotation: 90
                        }
                    });
                }                
            });


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/dalvik', function (response) {
                var sysdump = response.data;
                if (!angular.isUndefined(sysdump.type)) {
                    $scope.chartSystemEventConfig.options.xAxis.plotLines.push({
                        value: sysdump.time,
                        color: 'red',
                        width: 1,
                        dashStyle: 'longdashdot',
                        label: {
                            text: sysdump.type,
                            rotation: 90
                        }
                    });
                }
            });

            $scope.chartSystemEventConfig = {

                options: {

                    chart: {
                        zoomType: 'x',
                        animation: Highcharts.svg,
                        events: {
                            load: function () {
                                ChartService.SystemEventChartConfig = this;
                            },

                            selection: function(event) {
                                ChartService.zoomAllChartsIn(event.xAxis[0].min, event.xAxis[0].max);
                            }
                        },

                        resetZoomButton: {
                            theme: {
                                display: 'none'
                            }
                        },
                    },

                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                        plotLines: [],
                        options: {}
                    },

                    yAxis: [{
                        labels: {
                            align: 'left',
                            x: 3
                        },
                        title: {
                            text: 'System events'
                        },
                    }],

                    title: null,

                    // tooltip: {
                    //     shared: true,
                    //     crosshairs: true,
                    //     pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} KB</b><br/>',
                    //     shadow: false,
                    //     hideDelay: 0
                    // },

                    legend: {
                        enabled: true,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 50,
                        padding: 0,
                        itemMarginTop: 5,
                        itemMarginBottom: 5
                    }
                },

                series: [
                    {
                        name: 'Orientation',
                        color: 'blue',
                        pointInterval: 1000,
                    },
                    {
                        name: 'GC',
                        color: 'red',
                        pointInterval: 1000,
                    },
                    {
                        name: 'State',
                        color: 'green',
                        data: [],
                        pointInterval: 1000,
                    }
                ],


                credits: {
                    enabled: false
                },


                useHighStocks: false,
                loading: false

            };

        }]);