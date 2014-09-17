'use strict';

angular.module('samanthaApp').directive('flyClip', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            target: '@',
            offset: '@',
            open: '=',
            onOpen: '&',
            onClose:'&'
        },
        link: function ($scope, $elem) {
            var clipPropFirst = 'auto';
            var clipPropLast = 'auto';
            var window = angular.element($window);

            $scope.$watch('target', function (value) {
                var target = angular.element.find('#' + value)[0];
                if (!target) {
                    return;
                }
                var layoutProp = $scope.getItemLayoutProp(target, $scope.offset);

                clipPropFirst = 'rect(' + layoutProp.top + 'px ' + ( layoutProp.left + layoutProp.width ) + 'px ' + ( layoutProp.top + layoutProp.height ) + 'px ' + layoutProp.left + 'px)';
                clipPropLast = 'rect(0px ' + window.width() + 'px ' + window.height() + 'px 0px)';
            });

            $scope.$watch('open', function (value) {
                if (value === true) {
                    $scope.$eval($scope.onOpen);
                    $elem.addClass('open');
                    $elem.css({
                        'clip': clipPropFirst,
                        'pointer-events': 'none'
                    });

                    $timeout(function () {
                        $elem.css({
                            'clip': clipPropLast,
                            'pointer-events': 'auto'
                        });
                    }, 150);
                } else {
                    $elem.css({
                        'clip': clipPropFirst,
                        'pointer-events': 'none'
                    });

                    $timeout(function () {
                        $elem.css({
                            'clip': 'auto',
                            'pointere-events': 'none'
                        });
                        $elem.removeClass('open');
                        $scope.$eval($scope.onClose);
                    }, 450);
                }
            });

            $scope.$watch(function () {

                return {
                    w: window.width(),
                    h: window.height()
                };
            }, function (newValue) {
                if ($scope.open === true) {
                    clipPropLast = 'rect(0px ' + newValue.w + 'px ' + newValue.h + 'px 0px)';
                    $elem.css({
                        'clip': clipPropLast,
                    });
                }
            }, true);

        },
        controller: ['$scope', function ($scope) {
            $scope.getItemLayoutProp = function (item, offset) {

                if(!offset){
                    offset = 0;
                }
                var window = angular.element($window);
                var item = angular.element(item);
                var scrollT = window.scrollTop(),
                    scrollL = window.scrollLeft(),
                    itemOffset = item.offset();

                return {
                    left: itemOffset.left - scrollL,
                    top: itemOffset.top - scrollT - offset,
                    width: item.outerWidth(),
                    height: item.outerHeight()
                };

            }
        }]
    }

}]);