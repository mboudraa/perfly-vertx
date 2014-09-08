angular.module('samanthaApp').factory('ChartService', function () {
    return {
        MemoryChartConfig: null,
        CpuChartConfig: null,
        SystemEventChartConfig: null,
        UpdatingTimer: null,

        computeTickInterval: function(xMin, xMax) {
            var zoomRange = xMax - xMin;

            if (zoomRange <= 2)
                currentTickInterval = 0.5;
            if (zoomRange < 20)
                currentTickInterval = 1;
            else if (zoomRange < 100)
                currentTickInterval = 5;
        },

        startUpdatingCharts: function() {
            var self = this;
            this.UpdatingTimer = setInterval(function () {
                var max = new Date().getTime();
                var min = max - 60 * 1000;
                self.MemoryChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.CpuChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.SystemEventChartConfig.xAxis[0].setExtremes(min, max, true); 
            }, 200);
        },

        stopUpdatingCharts: function() {
            clearInterval(this.UpdatingTimer); 
        },

        zoomAllChartsIn: function(min, max) {
            this.stopUpdatingCharts();
            this.MemoryChartConfig.xAxis[0].isDirty = true;
            this.MemoryChartConfig.xAxis[0].setExtremes(min, max, true);    
            this.CpuChartConfig.xAxis[0].isDirty = true;
            this.CpuChartConfig.xAxis[0].setExtremes(min, max, true);   
            this.SystemEventChartConfig.xAxis[0].isDirty = true;
            this.SystemEventChartConfig.xAxis[0].setExtremes(min, max, true);                 
        },

        zoomAllChartsOut: function() {
            this.startUpdatingCharts();
        }
    }
});