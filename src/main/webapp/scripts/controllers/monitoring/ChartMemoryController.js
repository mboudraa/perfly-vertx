'use strict';

angular.module('samanthaApp')
    .controller('ChartMemoryCtrl', ['$scope', 'vertxEventBusService',
        function ($scope, vertxEventBusService) {

            var seriesOptions = [];
            var names = ['appTotal', 'appDalvik', 'appNative', 'dalvikLimit'];

            _.each(names, function (name, i) {
                seriesOptions[i] = {
                    name: name,
                    data: []
                }
            });
            var time = -1;
            vertxEventBusService.on('vertx.app.start', function () {
                _.each($scope.chartMemoryConfig.series, function (serie, i) {
                    serie.data.length = 0;
                });
            });
            vertxEventBusService.on('android.monitoring.progress', function (sysdump) {
                if (time == -1) {
                    time = sysdump.time;
                }
                _.each($scope.chartMemoryConfig.series, function (serie, i) {
                    serie.data.push({
                        x: (sysdump.time - time) / 1000,
                        y: sysdump.memoryInfo[serie.name],
                        marker: {enabled: false}
                    });
                });
                console.log(sysdump);
            });

            $scope.chartMemoryConfig = {

                options: {

                    chart: {
                        zoomType: 'x'
                    },

                    rangeSelector: {
                        inputEnabled: false
                    },
                    tooltip: {
                        shared: true,
                        crosshairs: true,
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} KB</b><br/>'

                    },
                    navigator: {
                        enabled: true,
                        adaptToUpdatedData: true
                    }
                },

                series: seriesOptions,

                credits: {
                    enabled: false
                },


                useHighStocks: true,
                loading: false

            };

            /*{
                //This is not a highcharts object. It just looks a little like one!
                options: {
                    //This is the Main Highcharts chart config. Any Highchart options are valid here.
                    //will be ovverriden by values specified below.
                    chart: {
                        type: 'bar'
                    },
                    tooltip: {
                        style: {
                            padding: 10,
                            fontWeight: 'bold'
                        }
                    }
                },

                //The below properties are watched separately for changes.

                //Series object (optional) - a list of series using normal highcharts series options.
                series: [{
                    data: [10, 15, 12, 8, 7]
                }],
                //Title configuration (optional)
                title: {
                    text: 'Hello'
                },
                //Boolean to control showng loading status on chart (optional)
                loading: false,
                //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
                //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
                xAxis: {
                    currentMin: 0,
                    currentMax: 20,
                    title: {text: 'values'}
                },
                //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
                useHighStocks: true
            };*/


        }]);