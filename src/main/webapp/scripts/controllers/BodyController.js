'use strict';

angular.module('samanthaApp')
    .controller('BodyCtrl', ['$scope', function ($scope) {
        $scope.body = {
            scrollable: true,

            setScrollable: function (scrollable) {
                this.scrollable = scrollable;
            }
        };

    }]);
