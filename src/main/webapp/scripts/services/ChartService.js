angular.module('samanthaApp').factory('ChartService', ['$interval', '$rootScope',
    function ($interval, $rootScope) {

        var startingDate;
        var charts = {};
        var timeline = {}
        var chartsTimer;
        var timelineTimer;

        function startCharts() {
            startingDate = getNow();
            startZoomableCharts();
            startTimelineChart();
        }

        function stopCharts() {
            stopZoomableCharts();
            stopTimelineChart();
        }

        function resetCharts() {
            _(charts).forEach(function (chart) {
                _(chart.series).forEach(function (serie) {
                    serie.setData([], true);
                });
            });

            _(timeline.series).forEach(function (serie) {
                serie.setData([], true);
            });

        }

        function addChart(key, chart) {
            charts[key] = chart;
        };

        function getTimeline() {
            return timeline;
        }

        function setTimeline(chart) {
            timeline = chart;
        };


        function zoom(min, max) {
            stopZoomableCharts();
            _(charts).forEach(function (chart) {
                chart.xAxis[0].isDirty = true;
                chart.xAxis[0].setExtremes(min, max, true);
            });
            $rootScope.$broadcast('chart.status', {zoomed: true})
        }

        function resetZoom() {
            $rootScope.$broadcast('chart.status', {zoomed: false})
            startZoomableCharts();
        }

        function startZoomableCharts() {

            chartsTimer = $interval(function () {
                var now = getNow();
                _(charts).forEach(function (chart) {
                    var max = Math.max(startingDate + 60 * 1000, now);
                    var min = Math.max(startingDate, now - 60 * 1000);

                    chart.xAxis[0].setExtremes(min, max, true);
                });

            }, 500);
        };


        function startTimelineChart() {
            if (!_.isEmpty(timeline)) {
                timelineTimer = $interval(function () {
                    var max = getNow();
                    var min = startingDate;
                    timeline.xAxis[0].setExtremes(min, max, true, true);

                }, 1000);
            }
        };


        function stopZoomableCharts() {
            $interval.cancel(chartsTimer);
        };

        function stopTimelineChart() {
            $interval.cancel(timelineTimer);
        };


        function getNow() {
            return (new Date()).getTime();
        };


        return {
            charts: charts,
            getTimeline: getTimeline,
            setTimeline: setTimeline,
            addChart: addChart,
            startCharts: startCharts,
            stopCharts: stopCharts,
            resetCharts: resetCharts,
            zoom: zoom,
            resetZoom: resetZoom
        }
    }]);