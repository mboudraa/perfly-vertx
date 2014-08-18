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

            vertxEventBusService.on(deviceId + '/vertx.monitoring.start', function (response) {
                if (packageName != response.data.packageName) {
                    packageName = response.data.packageName;
                    resetSeries();
                }
            });

            var time = -1;
            vertxEventBusService.on(deviceId + '/android.monitoring.progress', function (response) {
                var sysdump = response.data;

                if (time == -1) {
                    time = sysdump.time;
                }
                _.each(series, function (serie, i) {
                    var point = {
                        x: (sysdump.time - time) / 1000,
                        y: sysdump.cpuInfo[serie.name],
                        marker: {
                            enabled: false
                        }
                    };
                    serie.addPoint(point, true)
                });
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

                    rangeSelector: {
                        buttons: [{
                            type: 'all',
                            text: 'All'
                        }],
                        inputEnabled: false
                    },

                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} %</b><br/>'

                    }
                },

                series: [
                    {
                        name: 'cpuTotal',
                        type: 'area',
                        data: []
                    },
                    {
                        name: 'cpuUser',
                        data: []
                    },
                    {
                        name: 'cpuKernel',
                        data: []
                    }
                ],

                credits: {
                    enabled: false
                },


                useHighStocks: true,
                loading: false

            };

        }]);