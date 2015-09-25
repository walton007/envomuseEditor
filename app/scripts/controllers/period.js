'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.controller:PeriodCtrl
 * @description
 * # PeriodCtrl
 * Controller of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
  .controller('PeriodCtrl', ['$scope', 'dateTemplateService', 'lodash' , function ($scope, dateTemplateService, lodash) {
    var curDateTemplate = dateTemplateService.getActiveDateTemplate();
    var periodInfo = curDateTemplate.getPeriodInfo();
    $scope.init = function() {
      $scope.periodInfo = periodInfo;
      $scope.dt = new Date();
    };

    $scope.init();

    $scope.changeCalcType = function() {
      console.log('changeCalcType');
      console.log($scope.periodInfo.calcType);
    };

    $scope.addMultipleDatesValues = function(inDate) {
      var date = lodash.find(periodInfo.multipleDatesValues, function(date) {
        console.log(date);
        return date.getYear() === inDate.getYear()
        && date.getMonth() === inDate.getMonth()
        && date.getDate() === inDate.getDate();
      });
      console.log('find date:', date);
      if (date) {
        return;
      };
      periodInfo.multipleDatesValues.push(inDate);
      console.log('addMultipleDatesValues');
    };

    $scope.removeMultipleDatesValues = function(idx) {
      periodInfo.multipleDatesValues.splice(idx, 1);
      console.log('removeMultipleDatesValues');
    };

    $scope.setDaysOfWeekMode = function(type) {
      console.log('setDaysOfWeekMode:', type);
      if (type === 'weekday') {
        periodInfo.daysOfWeekValues = {
          'Mon': true, 
          'Tue': true,
          'Wed': true, 
          'Thur': true, 
          'Fri': true, 
          'Sat': false, 
          'Sun': false
        };
      }
      if (type === 'weekend') {
        periodInfo.daysOfWeekValues = {
          'Mon': false, 
          'Tue': false,
          'Wed': false, 
          'Thur': false, 
          'Fri': false, 
          'Sat': true, 
          'Sun': true
        };
      }
      if (type === 'everyday') {
        periodInfo.daysOfWeekValues = {
          'Mon': true, 
          'Tue': true,
          'Wed': true, 
          'Thur': true, 
          'Fri': true, 
          'Sat': true, 
          'Sun': true
        };
      }
    };
     
  }]);
