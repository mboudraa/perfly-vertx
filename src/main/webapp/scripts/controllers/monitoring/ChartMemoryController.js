'use strict';

angular.module('samanthaApp')
    .controller('ChartMemoryCtrl', ['$scope', 'vertxEventBusService','$routeParams',
        function ($scope, vertxEventBusService,$routeParams) {

            var packageName;
            var series = [];

            var deviceId = $routeParams['deviceId'];

            function resetSeries() {
                _.each(series, function (serie, i) {
                    serie.setData([], true);
                });
            };

            vertxEventBusService.on('vertx.monitoring.start', function (response) {
                if (response.deviceId == deviceId && packageName != response.packageName) {
                    packageName = response.packageName;
                    resetSeries();
                }
            });

            var time = -1;
            vertxEventBusService.on(deviceId+'/android.monitoring.progress', function (response) {
                var sysdump = response.data;

                if (time == -1) {
                    time = sysdump.time;
                }
                _.each(series, function (serie, i) {
                    var point = {
                        x: (sysdump.time - time) / 1000,
                        y: sysdump.memoryInfo[serie.name],
                        marker: {
                            enabled: false
                        }
                    };
                    serie.addPoint(point, true)
                });
            });

            $scope.chartMemoryConfig = {

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
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} KB</b><br/>'

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
                        color: '#FF0000'
                    },
                    {
                        name: 'appTotal',
                        type: 'area',
                        data: []
                    },
                    {
                        name: 'appNative',
                        data: []
                    },
                    {
                        name: 'appDalvik',
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