'use strict';

angular.module('samanthaApp').directive('polymerDialog',[ function() {
    return {
        restrict: 'E',
        scope: {
            id: '=',
            backdrop:'=',
            layered:'=',
            autoCloseDisabled:'=',
            opened:'=',
            heading:'=',
            transition:'='
        },
        transclude: true,
        templateUrl:"../../partials/dialog.html"
    }
}]);