'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.controller:OperationCtrl
 * @description
 * # OperationCtrl
 * Controller of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
  .controller('OperationCtrl', ['$rootScope', '$scope', 'archiveService', 'dialogs',
   function ($rootScope, $scope, archiveService, dialogs) {
	$scope.currentEnvFile = '';

	$scope.setCurrentEnvFile = function (currentEnvFile) {
		if (!$scope.$$phase) {
			//$digest or $apply
			$scope.$apply(function () {
			  $scope.currentEnvFile = currentEnvFile;
			});
		} else {
			$scope.currentEnvFile = currentEnvFile;
		}
	}

	$scope.saveEnvoFile = function  ( ) {
      // body...
      if ($scope.currentEnvFile.length < 5) {
      	alert('当前envo file不存在, 请先另存为');
      	return;
      }
      archiveService.saveAs($scope.currentEnvFile);
      $scope.setCurrentEnvFile ($scope.currentEnvFile);
    };

    $scope.saveAsNewEnvoFile = function  (file) {
      // body...
      console.log('saveConfigFile file', file.path);
      archiveService.saveAs(file.path);
      $scope.setCurrentEnvFile (file.path);
      
    };

    $scope.openEnvoFile = function  (file) {
      // body...
      console.log('openEnvoFile file', file.path);
      archiveService.recoverFrom(file.path);

      $scope.setCurrentEnvFile (file.path);
    };

    $scope.openExportDialog = function () {
      var dlg = dialogs.create('views/exportSetting.html','ExportPackageCtrl',
        {},
        {size:'md'});
      dlg.result.then(function (result) {
        if (result.value === 'success') {
          alert('生成成功!'+ result.filepath);
        } else {
          alert(result.error);
        }
      }, function () {
        // alert('cancel'); 
      })
      return;
    };
    
  }])
.controller('ExportPackageCtrl', ['$rootScope', '$scope', '$modalInstance', 'utilService', 'archiveService', '$log',
   function ($rootScope, $scope, $modalInstance, utilService, archiveService, $log) {
    $scope.name = '';
    $scope.brand = '';
    $scope.creator = '';

    $scope.exportPackage = function (file) {
      $log.log('exportPackage file');

      utilService.showLoading();

      var option = {
        name: $scope.name,
        brand: $scope.brand,
        creator: $scope.creator
      };

      archiveService.exportPackage(file.path, option)
      .then(function () {
        $modalInstance.close({
          value: 'success',
          filepath: file.path
        });
      }, function (err) {
        // alert('失败', err);
        $modalInstance.close({
          value: 'fail',
          error: err
        });
      })
      .finally(function () {
        utilService.hideLoading();
      });
    }
   }]);
