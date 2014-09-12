'use strict';

angular.module('samanthaApp')
    .controller('ChartMasterCtrl', ['$scope', 'vertxEventBusService', '$routeParams', 'ChartService',
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
                    var point = {
                        x: sysdump.time,
                        y: sysdump.cpuInfo.cpuTotal,
                        marker: {
                            enabled: false
                        }
                    };
                    series[0].addPoint(point, false, false, false);
                }
            });

            $scope.chartMasterConfig = {

                options: {

                    chart: {
                        backgroundColor: '#f0f3f6',
                        marginRight: 124,
                        zoomType: 'x',
                        events: {
                            load: function () {
                                series = this.series;
                                ChartService.MasterChartConfig = this;
                            },

                            selection: function(event) {
                                ChartService.zoomAllChartsIn(event.xAxis[0].min, event.xAxis[0].max);
                                return false;
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
                        showLastTickLabel: true,
                        maxZoom: 1000,
                        plotBands: [{
                            id: 'mask-before',
                            from: (new Date()).getTime(),
                            to: (new Date()).getTime(),
                            color: 'rgba(0, 0, 0, 0.2)'
                        }],
                        title: {
                            text: null
                        }
                    },

                    yAxis: [{
                        labels: {
                            align: 'left',
                            x: 3
                        },
                        title: {
                            text: 'Master'
                        },
                    }],

                    title: null,

                    tooltip: {
                        enabled: false
                    },

                    legend: {
                        enabled: false
                    }
                },

                series: [
                    {
                        name: 'cpuTotal',
                        data: [],
                        pointInterval: 1000
                    }
                ],

                plotOptions: {
                    series: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 70],
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, 'rgba(255,255,255,0)']
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        enableMouseTracking: false
                    }
                },

                credits: {
                    enabled: false
                },


                useHighStocks: false,
                loading: false

            };

        }]);