'use strict';

angular.module('perfly')
    .controller('ApplicationsCtrl', ['$scope', '$rootScope', 'vertxEventBusService', '$routeParams', '$location', '$http', 'ChartService', '$materialDialog', '$timeout',
        function ($scope, $rootScope, vertxEventBusService, $routeParams, $location, $http, ChartService, $materialDialog, $timeout) {

            $scope.ctrl = {
                monitoredApplication: undefined,
                monitoring: false,
                monitoringOpened: false,
                showGraph: false,
                selectedApplicationIndex: -1,
            };


            $scope.applications = [];
            $scope.search = '';
            $scope.openSearch = false;

            var deviceId = $routeParams['deviceId'];
            var progressDialogOpened = false;

            $scope.goHome = function () {
                $location.path('/');
            }

            $scope.getPaletteTarget = function (index) {
                return [{target: 'tile-header-' + index, alpha: 0.05}];
            }

            $scope.openConnectionDialog = function () {
                $materialDialog({
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    locals: {
                        deviceId: deviceId,
                    },
                    templateUrl: '../../partials/template/connectionDialog.html',
                    controller: ['$scope', '$rootScope', '$hideDialog', 'vertxEventBusService', 'deviceId',
                        function ($scope, $rootScope, $hideDialog, vertxEventBusService, deviceId) {
                            var COUNTDOWN = 5 * 60;

                            $scope.timer = {countdown: COUNTDOWN};
                            $rootScope.$broadcast('timer-start');


                            $scope.close = function () {
                                $hideDialog();
                            };

                            $scope.onTimerFinished = function () {
                                $hideDialog();
                                $location.path('/');
                            }

                            vertxEventBusService.on('device.connect', function (device) {
                                if (deviceId == device.id) {
                                    $hideDialog();
                                    $rootScope.$broadcast('timer-stop');
                                    $rootScope.$broadcast('timer-set-countdown', COUNTDOWN);
                                }
                            });


                        }]
                });
            };

            vertxEventBusService.on('device.disconnect', function (device) {
                if (deviceId == device.id) {
                    $scope.openConnectionDialog();
                }
            });

            $scope.openProgressDialog = function () {
                progressDialogOpened = true;
                $materialDialog({
                    clickOutsideToClose: false,
                    escapeToClose: false,
                    templateUrl: '../../partials/template/progressDialog.html',
                    locals: {
                        deviceId: deviceId
                    },
                    controller: ['$scope', '$hideDialog', 'vertxEventBusService', 'deviceId',
                        function ($scope, $hideDialog, vertxEventBusService, deviceId) {

                            $scope.progressDialog = {
                                loading: false,
                                title: "Waiting for Device...",
                                total: 0,
                                progress: 0,
                                appName: ''
                            };

                            vertxEventBusService.on(deviceId + '/android.apps.start', function (response) {
                                $scope.progressDialog.total = response.data.total;
                                $scope.progressDialog.title = "Getting List of Installed Apps...";
                                $scope.progressDialog.loading = true;
                            });


                            vertxEventBusService.on(deviceId + '/android.apps.progress', function (response) {
                                if ($scope.progressDialog.loading === false) {
                                    $scope.progressDialog.total = response.data.total;
                                    $scope.progressDialog.title = "Getting List of Installed Apps...";
                                    $scope.progressDialog.loading = true;
                                }
                                $scope.progressDialog.progress = response.data.progress;
                                $scope.progressDialog.appName = response.data.application.label
                            });

                            vertxEventBusService.on(deviceId + '/android.apps.finish', function () {
                                $hideDialog();
                            });

                            vertxEventBusService.on('device.disconnect', function (device) {
                                $hideDialog();
                            });

                        }]
                });
            };


            $scope.toggleSearch = function () {
                if ($scope.openSearch == false) {
                    $scope.openSearch = true;
                } else if (_.isEmpty($scope.search)) {
                    $scope.openSearch = false;
                }
            }


            vertxEventBusService.on(deviceId + '/android.apps.progress', function (response) {
                $scope.applications.push(response.data.application);
                if (!progressDialogOpened) {
                    $scope.openProgressDialog();
                }
            });

            vertxEventBusService.on(deviceId + '/android.apps.start', function (response) {
                $scope.applications.length = 0;
            });

            $scope.startMonitoring = function (application, index) {
                $scope.ctrl.selectedApplicationIndex = index;
                $scope.ctrl.monitoredApplication = application;
                $scope.ctrl.monitoringOpened = true;
                $timeout(function () {
                    $scope.ctrl.showGraph = true;
                    $scope.startApplication(application)
                }, 400)
            }

            $scope.endMonitoring = function () {
                $scope.stopApplication()
                $scope.ctrl.monitoringOpened = false;
                $scope.ctrl.showGraph = false;
                $timeout(function () {
                    $scope.ctrl.selectedApplicationIndex = -1;
                    $scope.ctrl.monitoredApplication = undefined;
                }, 400)
            }

            $scope.toggleMonitoring = function () {
                if ($scope.ctrl.monitoring == true) {
                    $scope.stopApplication();
                } else {
                    $scope.startApplication($scope.ctrl.monitoredApplication);
                }
            }

            $scope.startApplication = function (application) {
                $scope.ctrl.monitoring = true;
                //$location.search("monitoring", application.packageName);

                vertxEventBusService.publish("vertx.monitoring.start", {
                    deviceId: deviceId,
                    packageName: application.packageName
                });

            }

            $scope.stopApplication = function () {

                vertxEventBusService.publish("vertx.monitoring.stop", {
                    deviceId: deviceId
                });

                $scope.ctrl.monitoring = false;
            }


            $scope.refreshApplications = function (forceRefresh) {
                forceRefresh = forceRefresh ? forceRefresh : false;
                vertxEventBusService.publish("vertx.apps.get", {
                    deviceId: deviceId,
                    forceRefresh: forceRefresh
                });
            }

            $scope.searchComparator = function (app) {
                if (!app) {
                    return false;
                }
                if (!$scope.search || $scope.search.length <= 2) {
                    return true;
                }

                return (app.label.toLowerCase().indexOf($scope.search.toLowerCase()) > -1)
                || (app.packageName.toLowerCase().indexOf($scope.search.toLowerCase()) > -1);
            }


            $http.get("/devices/" + deviceId + "/apps")
                .success(function (response) {
                    $scope.applications = response;
                })
                .error(function () {
                    $scope.openProgressDialog();
                });

            $http.get("/devices/" + deviceId).success(function (response) {
                if (angular.isUndefined(response.device) || response.device == null) {
                    $location.path('/');
                }
            });

            //$scope.openProgressDialog();

        }]);
