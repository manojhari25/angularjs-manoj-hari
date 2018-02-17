
angular = require('angular');
require('angular-route');
require('../dist/templateCachePartials');

angular.module('sampleapp', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';

		var routeConfig = {
			controller: 'homeCtrl as vm',
			templateUrl: '/partials/home.html',
			resolve: {
				store: ['sampleService', function (data) {					
					return data;
				}]
			}
		};
		$routeProvider
			.when('/', routeConfig)
			.when('/:status', routeConfig)
			.otherwise({
				redirectTo: '/'
			});
	});

require('homeCtrl');
require('userService');
require('header');
require('footer');
