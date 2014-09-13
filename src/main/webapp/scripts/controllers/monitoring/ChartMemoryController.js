'use strict';

angular.module('samanthaApp')
    .controller('ChartMemoryCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, $rootScope, vertxEventBusService, $routeParams, ChartService) {

            var packageName;
            var series = [];

            var deviceId = $routeParams['deviceId'];

            function resetSeries() {
                _.each(series, function (serie, i) {
                    serie.setData([], true);
                });
            };

            var onMonitoringStart = $rootScope.$on('samantha.monitoring.start', function(event, args) {
                if (args.deviceId == deviceId) {
                    packageName = args.packageName;
                    resetSeries();
                }
            });

            $scope.$on('$destroy', onMonitoringStart);


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/monitoring', function (response) {
                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.memoryInfo)) {
                    _.each(series, function (serie, i) {
                        var point = {
                            x: sysdump.time,
                            y: sysdump.memoryInfo[serie.name],
                            marker: {
                                enabled: false
                            }
                        };
                        serie.addPoint(point, false, false, false);
                    });
                }
            });

            $scope.chartMemoryConfig = {

                options: {

                    chart: {
                        zoomType: 'x',
                        animation: Highcharts.svg,
                        events: {
                            load: function () {
                                series = this.series;
                                ChartService.MemoryChartConfig = this;
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

                    yAxis: [{
                        labels: {
                            align: 'left',
                            x: 3
                        },
                        title: {
                            text: 'Memory (KB)'
                        },
                    }],

                    title: null,

                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                        options: {}
                    },

                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} KB</b><br/>',
                        shadow: false,
                        hideDelay: 0
                    },

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
                        name: 'dalvikLimit',
                        data: [],
                        color: '#FF0000',
                        pointInterval: 500,
                    },
                    {
                        name: 'appTotal',
                        type: 'area',
                        data: [],
                        pointInterval: 500,
                    },
                    {
                        name: 'appNative',
                        data: [],
                        pointInterval: 500,
                    },
                    {
                        name: 'appDalvik',
                        data: [],
                        pointInterval: 500,
                    }
                ],


                credits: {
                    enabled: false
                },


                useHighStocks: false,
                loading: false

            };

        }]);