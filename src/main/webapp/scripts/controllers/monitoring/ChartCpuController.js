'use strict';

angular.module('samanthaApp')
    .controller('ChartCpuCtrl', ['$scope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, vertxEventBusService, $routeParams, ChartService) {

            var packageName;
            var series = [];

            var deviceId = $routeParams['deviceId'];

            function resetSeries() {
                _.each(series, function (serie, i) {
                    serie.setData([], true);
                });
            }

            vertxEventBusService.on('vertx.monitoring.start', function (response) {
                if (response.deviceId == deviceId) {
                    packageName = response.packageName;
                    resetSeries();
                }
            });

            vertxEventBusService.on(deviceId + '/android.monitoring.progress/monitoring', function (response) {
                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.cpuInfo)) {
                    _.each(series, function (serie, i) {
                        var point = {
                            x: sysdump.time,
                            y: sysdump.cpuInfo[serie.name],
                            marker: {
                                enabled: false
                            }
                        };
                        serie.addPoint(point, false, false, false);
                    });
                }
            });

            $scope.chartCpuConfig = {

                options: {

                    chart: {
                        backgroundColor: '#f0f3f6',
                        zoomType: 'x',
                        events: {
                            load: function () {
                                series = this.series;
                                ChartService.CpuChartConfig = this;
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
                        tickPixelInterval: 150
                    },

                    yAxis: [{
                        labels: {
                            align: 'left',
                            x: 3
                        },
                        title: {
                            text: 'CPU Usage (%)'
                        },
                    }],

                    title: null,

                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} %</b><br/>'

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
                        name: 'cpuTotal',
                        type: 'area',
                        data: [],
                        pointInterval: 1000
                    },
                    {
                        name: 'cpuUser',
                        data: [],
                        pointInterval: 1000
                    },
                    {
                        name: 'cpuKernel',
                        data: [],
                        pointInterval: 1000
                    }
                ],

                credits: {
                    enabled: false
                },


                useHighStocks: false,
                loading: false

            };

        }]);