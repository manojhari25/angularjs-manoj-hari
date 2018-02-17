angular = require('angular');
angular.module('sampleapp')
	.factory('sampleService', function ($http) {
		'use strict';
		return $http.get("https://jsonplaceholder.typicode.com/users")
		.then(function(response) {
			return response.data;
		});
	});
