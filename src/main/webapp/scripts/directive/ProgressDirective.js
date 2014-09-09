'use strict';

angular.module('samanthaApp').directive('polymerProgress',[ function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            value:'=',
            max:'='
        },
        templateUrl:"../../partials/template/progress.html"
    }
}]);