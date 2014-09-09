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
        templateUrl:"../../partials/template/dialog.html"
    }
}]);