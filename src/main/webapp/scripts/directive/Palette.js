'use strict';

angular.module('perfly').directive('palette', ['$timeout', function ($timeout) {
    var colorThief = new ColorThief();

    return {
        restrict: 'A',
        scope: {
            target: '@',
            delay: '@',
        },
        link: function ($scope, $elem) {

            $scope.delay = $scope.delay ? $scope.delay : 0;
            //$scope.alpha = $scope.alpha ? $scope.alpha : "0.05";

            var palette = $scope.target;
            if (_.isString(palette)) {
                palette = JSON.parse(palette);
            }
            $timeout(function () {
                var color = colorThief.getColor($elem.closest("img")[0]);
                _.each(palette, function (target) {
                    var rgb = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ","+target.alpha+")";
                    $('#' + target.target).css({
                        'background': rgb
                    });
                })

            }, $scope.delay)


        }
    }

}]);