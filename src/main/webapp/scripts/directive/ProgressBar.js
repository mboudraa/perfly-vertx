'use strict';

angular.module('samanthaApp').directive('flyProgressbar', [function () {
    return {
        restrict: 'E',
        scope: {
            id: '@',
            value: '=',
            max: '='
        },
        template: '<div id="{{id}}" class="progress-container"><div class="progress"></div></div>',
        link: function ($scope, $elem) {

            $scope.value = $scope.value || 0;
            $scope.max = $scope.max || 100;

            $scope.$watch('value', function (newVal) {
                var progress = newVal / $scope.max * 100;
                $elem.eq(0).children().css('width', progress + '%');
            });

            $scope.$watch('max', function (newVal) {
                $scope.max = newVal;
            });

        }
    }

}]);