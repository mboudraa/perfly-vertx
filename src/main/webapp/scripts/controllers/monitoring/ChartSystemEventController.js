'use strict';

angular.module('perfly')
    .controller('ChartSystemEventCtrl', ['$scope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, vertxEventBusService, $routeParams, ChartService) {

            var axis = [];
            var deviceId = $routeParams['deviceId'];
            var CHART_KEY = "events";


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/orientation', function (response) {
                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.orientation)) {
                    var orientationName = sysdump.orientation == 2 ? "landscape" : "portrait";
                    ChartService.charts[CHART_KEY].series[0].addPoint({
                        x: sysdump.time,
                        y: 2,
                        marker: {
                            enabled: true,
                            fillColor: 'blue',
                            lineWidth: 1,
                            lineColor: 'transparent',
                            symbol: 'text:\uf01e', // fa-rotate-right
                            states: {
                                hover: {
                                    fillColor: '#FFFFFF',
                                    lineWidth: 2,
                                    lineColor: 'blue'
                                }
                            }
                        },
                        tooltip: {
                            key: 'Orientation',
                            value: orientationName
                        }
                    });
                }
            });


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/status', function (response) {
                var sysdump = response.data;
                if (!angular.isUndefined(sysdump.applicationStatus)) {
                    ChartService.charts[CHART_KEY].series[1].addPoint({
                        x: sysdump.time,
                        y: 1,
                        marker: {
                            enabled: true,
                            lineWidth: 1,
                            lineColor: 'transparent',
                            fillColor: 'green',
                            symbol: 'text:\uf079', // fa-retweet
                            states: {
                                hover: {
                                    lineWidth: 2,
                                    fillColor: '#FFFFFF',
                                    lineColor: 'green'
                                }
                            }
                        },
                        tooltip: {
                            key: 'State',
                            value: sysdump.applicationStatus.state
                        }
                    });
                }
            });


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/dalvik', function (response) {
                var sysdump = response.data;
                if (!angular.isUndefined(sysdump.type)) {
                    ChartService.charts[CHART_KEY].series[2].addPoint({
                        x: sysdump.time,
                        y: 0,
                        marker: {
                            enabled: true,
                            fillColor: 'red',
                            lineWidth: 1,
                            lineColor: 'transparent',
                            symbol: 'text:\uf014', // fa-trash
                            states: {
                                hover: {
                                    fillColor: '#FFFFFF',
                                    lineWidth: 2,
                                    lineColor: 'red'
                                }
                            }
                        },
                        tooltip: {
                            key: sysdump.type,
                            value: sysdump.value
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
                                ChartService.addChart(CHART_KEY, this);
                            },

                            selection: function (event) {
                                ChartService.zoom(event.xAxis[0].min, event.xAxis[0].max);
                            }
                        },

                        resetZoomButton: {
                            theme: {
                                display: 'none'
                            }
                        },
                    },

                    plotOptions: {
                        series: {
                            color: 'transparent',
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150,
                        plotLines: [],
                        options: {}
                    },


                    yAxis: [{
                        labels: {
                            enabled: false,
                        },
                        title: {
                            text: 'Events'
                        },
                    }],

                    title: null,

                    tooltip: {
                        enabled: true,
                        crosshairs: true,
                        pointFormat: '<span>{point.tooltip.key}</span>: <b>{point.tooltip.value}</b><br/>',
                        shadow: false,
                        hideDelay: 0
                    },

                    legend: {
                        enabled: true,
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        itemMarginTop: 3,
                        itemMarginBottom: 3
                    }
                },

                series: [
                    {
                        name: 'Orientation',
                        data: [],
                        marker: {
                            symbol: 'text:\uf01e', // fa-rotate-right
                            fillColor: 'blue',
                            lineWidth: 1,
                            lineColor: 'transparent',
                        },
                        pointInterval: 1000
                    },

                    {
                        name: 'State',
                        data: [],
                        marker: {
                            symbol: 'text:\uf079', // fa-retweet
                            fillColor: 'green',
                            lineWidth: 1,
                            lineColor: 'transparent',
                        },
                        pointInterval: 1000
                    },
                    {
                        name: 'GC',
                        data: [],
                        marker: {
                            symbol: 'text:\uf014', // fa-trash
                            fillColor: 'red',
                            lineWidth: 1,
                            lineColor: 'transparent',
                        },
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