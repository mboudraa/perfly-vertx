'use strict';

angular.module('perfly')
    .controller('ChartMasterCtrl', ['$scope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, vertxEventBusService, $routeParams, ChartService) {

            var addCpuPoint = false;
            var addMemoryPoint = false;

            var deviceId = $routeParams['deviceId'];

            vertxEventBusService.on(deviceId + '/android.monitoring.progress/monitoring', function (response) {

                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.cpuInfo)) {

                    addCpuPoint = !addCpuPoint;
                    if (!addCpuPoint) {
                        return;
                    }

                    var point = {
                        x: sysdump.time,
                        y: sysdump.cpuInfo.cpuTotal,
                        marker: {
                            enabled: false
                        }
                    };
                    ChartService.getTimeline().series[0].addPoint(point, false, false, false);
                }

                if (!angular.isUndefined(sysdump.memoryInfo)) {

                    addMemoryPoint = !addMemoryPoint;
                    if (!addMemoryPoint) {
                        return;
                    }

                    var point = {
                        x: sysdump.time,
                        y: sysdump.memoryInfo.appTotal,
                        marker: {
                            enabled: false
                        }
                    };
                    ChartService.getTimeline().series[1].addPoint(point, false, false, false);
                }
            });

            $scope.chartMasterConfig = {

                options: {

                    chart: {
                        zoomType: 'x',
                        events: {
                            load: function () {
                                ChartService.setTimeline(this);
                            },

                            selection: function (event) {
                                ChartService.zoom(event.xAxis[0].min, event.xAxis[0].max);
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
                            text: 'CPU (%)'
                        },
                    },
                        {
                            labels: {
                                align: 'left',
                                x: 3
                            },
                            title: {
                                text: 'Memory (KB)'
                            },
                            opposite: true
                        }],

                    title: null,

                    tooltip: {
                        enabled: false
                    },

                    legend: {
                        enabled: true,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        y: 0,
                        padding: 0,
                        itemMarginTop: 5,
                        itemMarginBottom: 5
                    }
                },

                series: [
                    {
                        name: 'cpuTotal',
                        data: [],
                        pointInterval: 1000
                    },
                    {
                        name: 'memTotal',
                        data: [],
                        pointInterval: 1000,
                        yAxis: 1
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