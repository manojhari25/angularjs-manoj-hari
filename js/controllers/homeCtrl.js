
angular = require('angular');

angular.module('sampleapp')
	.controller('homeCtrl', function homeCtrl($scope, store) {
		'use strict';
		var vm = this;
		vm.data = store;		
	});
