'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.decorator:Log
 * @description
 * # Log
 * Decorator of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
	.config(function($provide) {
		$provide.decorator('$log', function($delegate) {
			// decorate the $delegate
			var debugFn = $delegate.debug;
			$delegate.debug = function() {
				var args = [].slice.call(arguments);

				// Prepend timestamp
				// console.log('xxx');

				// Call the original with the output prepended with formatted timestamp
				debugFn.apply(null, args)
			};
			return $delegate;
		});
	});