'use strict';

/**
 * @ngdoc directive
 * @name envomusMusicEditor.directive:fileDialog
 * @description
 * # fileDialog
 */
angular.module('envomusMusicEditor')
  .directive('fileDialog', function () {
    return {
      template: '<span class="btn btn-default btn-file"> {{title}} <input nwdirectory nwsaveas type="file"> </span>',
      scope: {
        onFileSelected: '='
      },
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        var inputEle = element.find('input');

        if ('saveas' in attrs) {
          // save file
          inputEle.removeAttr('nwdirectory'); 
        } else {
          inputEle.removeAttr('nwsaveas');
          if (!('webkitdirectory' in attrs) ) {
            inputEle.removeAttr('nwdirectory');
            console.log('inputEle.removeAttr');
          }; 
        }

        if ('accept' in attrs) {
          inputEle.attr('accept', attrs['accept']); 
        }

        inputEle.bind('change', function (evt) {
        	if (evt.target.files.length) {
            scope.onFileSelected(evt.target.files[0]);
        	}
          inputEle.val('');
        });

        element.on('$destroy', function() {
          inputEle.unbind('change');
        });
      }
    };
  });