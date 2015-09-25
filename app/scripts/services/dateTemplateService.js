'use strict';

/**
 * @ngdoc service
 * @name envomusMusicEditor.dateTemplateService
 * @description
 * # dateTemplateService
 * Factory in the envomusMusicEditor.
 */
angular.module('envomusMusicEditor')
  .factory('dateTemplateService', ['$rootScope', '$q', 'lodash', '$log','playerServie',
   function ($rootScope, $q, _, $log, playerServie) {
    // Service logic
    var walk = require('walk'),
        path = require('path'), 
        fs = require('fs');

    // private variable
    var dateTemplateMap = {},
    curActiveTemplateName = null;

    function _clear() {
      dateTemplateMap = {},
      curActiveTemplateName = null;
    }

    

      
    // dateTemplate function definition
    function DateTemplate(name) {
      this.name = name;
      this.rootDirectory = '',
      this.periodInfo = {
          calcType: "daysOfWeek",
          daysOfWeekValues: {
            'Mon': true, 
            'Tue': true,
            'Wed': true, 
            'Thur': true, 
            'Fri': true, 
            'Sat': false, 
            'Sun': false
          },
          dateRangeValues: {
            'startDate': new Date(),
            'endDate': new Date()
          },
          multipleDatesValues: [new Date(),],
        },
      this.boxes = [];
    };

    DateTemplate.supportAudioFormat = ['.mp3', '.wav'];
    DateTemplate.prototype = {
      resetBox: function () {
        this.boxes = [];
      },

      recover: function (dateTemplateObj) {
        this.name = dateTemplateObj.name;
        this.rootDirectory = dateTemplateObj.rootDirectory,
        this.periodInfo = dateTemplateObj.periodInfo,
        this.boxes = dateTemplateObj.boxes;
        return this;
      },

      getRootDirectory: function() {
        return this.rootDirectory;
      },

      getBoxList: function() {
        console.log('getBoxList:', this.boxes);
        return this.boxes;
      },

      getBox: function (boxName) {
        var retBox = undefined;
        angular.forEach(this.boxes, function(box) {
          if (box.name === boxName) {
            retBox = box;
          }
        });

        return retBox;
      },

      getTrackNum: function () {
        var trackNum = 0;
        _.each(this.boxes, function(box) {
          trackNum = trackNum + box.songList.length;
        });
        return trackNum;
      },

      getPeriodInfo: function () {
        return this.periodInfo;
      },

      setRootDirectory: function (_rootDirectory) {
        this.rootDirectory = _rootDirectory;
        return this.refresh();
      },

      refresh : function () {
        var deferred = $q.defer();
        var self = this;

        this.resetBox();
        var promises = [];
        var files = fs.readdirSync(this.rootDirectory);
        _.each(files, function(file) {
          var boxPath = path.resolve(self.rootDirectory, file);
          $log.info('－－－ box path:', boxPath);
          if (fs.lstatSync(boxPath).isDirectory()) {
            promises.push(self._appendBox(boxPath));
          }
        });

        if (promises.length === 0) {
          console.log('all done with no promises');
          // $rootScope.$emit('rootDirectoryChangeEvent', '');
          deferred.resolve();
          // return; 
        } else {
          $q.all(promises)
          .then(function () {
            console.log('all done');
            // $rootScope.$emit('rootDirectoryChangeEvent', '');
            deferred.resolve();
          });
        }

        return deferred.promise;
        
      },

      _appendBox: function (boxPath) {
        console.log('_appendBox', boxPath);
        var promises = [], deferred,
        song, box = {
          name: path.basename(boxPath),
          path: boxPath,
          songList: [],
          totalLength: 120,
          startTm: undefined,
          endTm: undefined
        };
        var options = {
          followLinks: false,
          listeners: {
            file: function (root, fileStat, next) {
              var extname = path.extname(fileStat.name);
              if (DateTemplate.supportAudioFormat.indexOf(extname) >= 0) {
                var filePath = path.resolve(root, fileStat.name);
                deferred = playerServie.getMetaInfo(filePath)
                .then(function (metaInfo) {
                  
                  console.log('_append song filePath', filePath);

                    song = {
                      name: fileStat.name,
                      extname: extname,
                      mime: extname === '.wav' ? 'audio/wav' : 'audio/mpeg',
                      path: filePath,
                      size: fileStat.size,
                      duration: metaInfo.duration
                    };
                    box.songList.push(song);
                    console.log('resolve');
                  });
                promises.push(deferred);
              };

              next();
            }
          }
        }
        walk.walkSync(boxPath, options);
        this.boxes.push(box);

        return $q.all(promises)
        .then(function() {
          var totalLength = 0;
          _.each(box.songList, function(song) {
            totalLength += song.duration;
          });
          box.totalLength = totalLength;
          console.log('totalLength is:', totalLength);
        });
      }
    };

    // Public API here
    return {
      getDateTemplateArray: function(){
        return _.values(dateTemplateMap);
      },

      getActiveDateTemplate: function() {
        if (curActiveTemplateName) {
          return dateTemplateMap[curActiveTemplateName];
        }

        return null;
      },

      setActiveDateTemplate: function (name) {
        if (name in dateTemplateMap) {
          curActiveTemplateName = name;
          $rootScope.$emit('activeDateTemplateChangeEvent', '');
          return dateTemplateMap[name];
        }

        return null;
      },

      createDateTemplate: function (name) {
        return new DateTemplate(name);
      },

      addDateTemplate: function (dateTemplate, setActive) {
        dateTemplateMap[dateTemplate.name] = dateTemplate;
        if (setActive) {
          this.setActiveDateTemplate(dateTemplate.name);
        }
      },

      removeDateTemplate: function (name) {
        delete dateTemplateMap[name];
        if (name === curActiveTemplateName) {
          curActiveTemplateName = null;
        }
      },

      getDateTemplate: function (name) {
        return dateTemplateMap[name];
      },

      getTotalTrackNum: function () {
        var totalTrackNum = 0;
        _.each(this.getDateTemplateArray(), function(dateTemplate) {
          totalTrackNum += dateTemplate.getTrackNum();
        });

        return totalTrackNum;
      },

      existDateTemplate: function (name) {
        return !!this.getDateTemplate(name); 
      },

      // Archive Feature
      valid: function () {
        return _.keys(dateTemplateMap).length > 0
        && _.every(dateTemplateMap, function (dateTemplate) {
          return dateTemplate.name.length > 0 && dateTemplate.rootDirectory.length > 0;
        }); 
      },

      archive: function () {
        return {
          dateTemplateArr: this.getDateTemplateArray()
        };
      },

      recover: function (dateTemplateConfig) {
        _clear();
        var self = this,
          dateTemplateArr = dateTemplateConfig.dateTemplateArr;
        _.each(dateTemplateArr, function (dateTemplateObj) {
          var dateTemplate = self.createDateTemplate(dateTemplateObj.name)
          dateTemplateMap[dateTemplateObj.name] = dateTemplate.recover(dateTemplateObj);
        });
        if (dateTemplateArr.length > 0) {
          this.setActiveDateTemplate(dateTemplateArr[0].name);
        }
      }
    };
}]);
