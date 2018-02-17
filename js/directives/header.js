angular.module('sampleapp')
    .directive('tdHeader', function () {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: '/partials/header.html'
        };

    });
