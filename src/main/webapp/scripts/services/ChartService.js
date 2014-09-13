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
                var now = (new Date()).getTime();
                var max = Math.max(self.StartingDate + 60 * 1000, now);
                var min = Math.max(self.StartingDate, now - 60 * 1000);
                self.MemoryChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.CpuChartConfig.xAxis[0].setExtremes(min, max, true); 
                self.SystemEventChartConfig.xAxis[0].setExtremes(min, max, true);
            }, 500);
        },

        startUpdatingMasterChart: function() {
            var self = this;
            this.MasterTimer = setInterval(function () {
                var max = (new Date()).getTime();
                var min = self.StartingDate;
                self.MasterChartConfig.xAxis[0].setExtremes(min, max, true); 
            }, 1000);
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