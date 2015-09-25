'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', '$log', '$q', 'utilService', 'dialogs', 'dateTemplateService',
    function($rootScope, $scope, $location, $log, $q, utilService, dialogs, dateTemplateService) {
      utilService.getVersion();
      // Sidebar operation
      $scope.updateDateTemplateArr = function() {
        $scope.dateTemplatesArr = dateTemplateService.getDateTemplateArray();
        $scope.dateTemplate = dateTemplateService.getActiveDateTemplate();
        if ($scope.dateTemplate) {
          $log.info('In updateDateTemplateArr:', $scope.dateTemplate.name, $scope.dateTemplate);
          $scope.setTimeLine($scope.dateTemplate.getBoxList());
          $scope.totalTrackNum = dateTemplateService.getTotalTrackNum();
          $log.info('totalTrackNum:', $scope.totalTrackNum);
        }
      }

      $scope.setActiveDateTemplateDialog = function(dateTemplate) {
        dateTemplateService.setActiveDateTemplate(dateTemplate.name);
        return;
      };

      $scope.openCreateNewDateTemplateDialog = function() {
        var dlg = dialogs.create('views/newDateTemplate.html', 'NewDateTemplateCtrl', {}, {
          size: 'md'
        });
        dlg.result.then(function(result) {
          if (result.value === 'success') {
            // alert('生成成功!'+ result.filepath);
            $scope.updateDateTemplateArr();
          } else {
            // alert(result.error);
          }
        }, function() {
          // alert('cancel'); 
        })
        return;
      };

      $scope.init = function() {

        console.log('MainCtrl init');
        $scope.updateDateTemplateArr();
      }

      // Active DateTemplate Operation
      $scope.openBoxDetail = function(box) {
        console.log('open box:', box);
        $location.path('/box/' + box.name);
      };

      $scope.onRootDirectorySelected = function(file) {
        $log.info('onRootDirectorySelected');
        utilService.showLoading();
        $scope.dateTemplate.setRootDirectory(file.path)
          // clockService.setRootDirectory(file.path)
          .then(function() {
            $log.info('after onRootDirectorySelected');
            dateTemplateService.setActiveDateTemplate($scope.dateTemplate.name);
          })
          .finally(function() {
            utilService.hideLoading();
          });
      };

      $scope.refreshRootDirectory = function() {
        // console.log('refreshRootDirectory');
        // if ($scope.rootDirectory) {
        //   // clockService.refresh();
        // }
      };

      $scope.removeCurrentDateTemplate = function() {
        console.log('removeCurrentDateTemplate');
        var dlg = dialogs.confirm('确认删除', '慎重删除啊！！');
        dlg.result.then(function(btn) {
          if ($scope.dateTemplate) {
            dateTemplateService.removeDateTemplate($scope.dateTemplate.name);
            $scope.updateDateTemplateArr();
          }

        },function(btn){
          
        });
      };

      $rootScope.$on('activeDateTemplateChangeEvent', function(evt) {
        if (!$scope.$$phase) {
          //$digest or $apply
          $scope.$apply(function() {
            $scope.updateDateTemplateArr();
          });
        } else {
          $scope.updateDateTemplateArr();
        }

      });

      $scope.setTimeLine = function(boxList) {
        $log.debug('setTimeLine');

        if (boxList.length > 0) {
          // console.log(boxList);
          var clock = boxList.filter(function(e) {
            return (typeof e.startTm !== 'undefined') && (typeof e.endTm !== 'undefined');
          }).map(function(e) {

            return {
              title: e.name,
              start: e.startTm,
              end: e.endTm,
              /*start:defaultDateStr.concat(e.startTm.substring(10)),
              end:defaultDateStr.concat(e.endTm.substring(10)),*/
              color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
            };
          });

          if (clock.length > 0) {
            $('#hourly').children().remove();
            $('#hourly').timestack({
              span: 'hour',
              data: clock
            });
          }
        }
      }

      // init all
      $scope.init();
    }
  ]);