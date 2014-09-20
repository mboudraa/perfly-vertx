'use strict';

angular.module('perfly')
    .controller('ChartCpuCtrl', ['$scope', 'vertxEventBusService', '$routeParams', 'ChartService',
        function ($scope, vertxEventBusService, $routeParams, ChartService) {

            var CHART_KEY = "cpu";
            var deviceId = $routeParams['deviceId'];


            vertxEventBusService.on(deviceId + '/android.monitoring.progress/monitoring', function (response) {
                var sysdump = response.data;

                if (!angular.isUndefined(sysdump.cpuInfo)) {
                    _.each(ChartService.charts[CHART_KEY].series, function (serie, i) {
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
                        zoomType: 'x',
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
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} %</b><br/>',
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
                        name: 'cpuTotal',
                        type: 'area',
                        data: [],
                        pointInterval: 500
                    },
                    {
                        name: 'cpuUser',
                        data: [],
                        pointInterval: 500
                    },
                    {
                        name: 'cpuKernel',
                        data: [],
                        pointInterval: 500
                    }
                ],

                credits: {
                    enabled: false
                },


                useHighStocks: false,
                loading: false

            };

        }]);