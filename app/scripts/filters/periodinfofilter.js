'use strict';

/**
 * @ngdoc filter
 * @name envomusMusicEditor.filter:periodInfoFilter
 * @function
 * @description
 * # periodInfoFilter
 * Filter in the envomusMusicEditor.
 */
angular.module('envomusMusicEditor')
  .filter('periodInfoFilter', function () {
    var keys = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    return function (periodInfo) {
        if (!periodInfo) {
            return '';
        }

        var calcType = periodInfo.calcType;
    	if (calcType === 'daysOfWeek') {
            var retStr = '星期:';
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
               if (periodInfo.daysOfWeekValues[key]) {
                    retStr = retStr + key + '  ';
               } 
            };
            
    		return retStr;
    	}
    	if (calcType === 'dateRange') {
            console.log('periodInfo.dateRangeValues.startDate:', typeof periodInfo.dateRangeValues.startDate, periodInfo.dateRangeValues.startDate);
            var startDate = new Date(periodInfo.dateRangeValues.startDate).toDateString(),
                endDate = new Date(periodInfo.dateRangeValues.endDate).toDateString();
    		return '时期段:'+ startDate + ' --- '+ endDate;
    	}
    	if (calcType === 'multipleDates') {
    		return '多日期'
    	}
    	return '';
    };
  });
