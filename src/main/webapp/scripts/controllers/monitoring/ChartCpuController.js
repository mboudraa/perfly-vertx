'use strict';

angular.module('samanthaApp')
    .controller('ChartCpuCtrl', ['$scope', 'vertxEventBusService', '$routeParams',
        function ($scope, vertxEventBusService, $routeParams) {

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

                if (sysdump.cpuInfo) {
                    _.each(series, function (serie, i) {
                        var point = {
                            x: sysdump.time,
                            y: sysdump.cpuInfo[serie.name],
                            marker: {
                                enabled: false
                            }
                        };
                        serie.addPoint(point, true)
                    });
                }
            });

            $scope.chartCpuConfig = {

                options: {

                    chart: {
                        zoomType: 'x',
                        events: {
                            load: function () {
                                series = this.series;
                            }
                        },
                    },
                    xAxis: {
                        type: 'datetime',
                        maxZoom: 1000
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