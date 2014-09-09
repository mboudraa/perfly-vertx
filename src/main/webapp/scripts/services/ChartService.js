angular.module('samanthaApp').factory('ChartService', function () {
    return {
        MemoryChartConfig: null,
        CpuChartConfig: null,
        SystemEventChartConfig: null,
        MasterChartConfig: null,
        UpdatingTimer: null,
        MasterTimer: null,
        StartingDate: (new Date()).getTime(),

        startUpdatingCharts: function() {
            var self = this;
            this.UpdatingTimer = setInterval(function () {
                var max = (new Date()).getTime();
                var min = max - 60 * 1000;
                min = self.StartingDate > min ? self.StartingDate : min;   
                self.MemoryChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.CpuChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.SystemEventChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.MasterChartConfig.xAxis[0].setExtremes(self.StartingDate, max, true); 
            }, 200);
        },

        startUpdatingMasterChart: function() {
            var self = this;
            this.MasterTimer = setInterval(function () {
                var max = (new Date()).getTime();
                self.MasterChartConfig.xAxis[0].setExtremes(self.StartingDate, max, true); 
            }, 600);
        },

        stopUpdatingCharts: function() {
            clearInterval(this.UpdatingTimer); 
        },

        stopUpdatingMasterChart: function() {
            clearInterval(this.MasterTimer); 
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