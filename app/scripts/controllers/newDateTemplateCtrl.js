'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.controller:OperationCtrl
 * @description
 * # OperationCtrl
 * Controller of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
.controller('NewDateTemplateCtrl', ['$rootScope', '$scope', '$modalInstance', '$log', 'dateTemplateService', 'utilService',
   function ($rootScope, $scope, $modalInstance, $log, dateTemplateService, utilService) {
    $scope.name = '';
    $scope.boxRootPath = '';

    $scope.createNewDateTemplate = function () {

      if (dateTemplateService.existDateTemplate($scope.name)) {
        alert($scope.name+"已经被使用，请换个名字!");
        return;
      }

      var dateTemplate = dateTemplateService.createDateTemplate($scope.name);
      if ($scope.boxRootPath.length > 0) {
        utilService.showLoading();
        dateTemplate.setRootDirectory($scope.boxRootPath)
        .then(function () {
          dateTemplateService.addDateTemplate(dateTemplate, true);
          $modalInstance.close({
            value: 'success'
          });
        }, function (error) {
          alert(error);
          $modalInstance.close({
            value: 'error',
            error: error
          });
        })
        .finally(function () {
          utilService.hideLoading();
        });
      } else {
        dateTemplateService.addDateTemplate(dateTemplate, true);
        $modalInstance.close({
          value: 'success'
        });
      }
    }

    $scope.onBoxRootDirectorySelected = function (file) {
      $log.log('onBoxRootDirectorySelected');
      if (!$scope.$$phase) {
        //$digest or $apply
        $scope.$apply(function () {
          $scope.boxRootPath = file.path;
        });
      } else {
        $scope.boxRootPath = file.path;
      }
    }
   }]);
