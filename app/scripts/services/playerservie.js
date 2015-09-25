'use strict';

/**
 * @ngdoc service
 * @name envomusMusicEditor.playerServie
 * @description
 * # playerServie
 * Factory in the envomusMusicEditor.
 */

angular.module('envomusMusicEditor')
  .factory('playerServie', ['$q', 'lodash', 'utilService', function($q, lodash, utilService) {
    //registor window events 
    var win = require('nw.gui').Window.get();
    win.on('close', function(){
      releaseResource();
      this.close(true);
    });

    //media player manage
    var mediaPlayerCache = {},
      assetCache = {},
      buzzSoundCache = {};

    function acquireMediaBuzzSound (filepath) {
      var sources = 'file://'+filepath;
      return new buzz.sound(sources);

      if (!(filepath in buzzSoundCache)) {
        var sources = 'file://'+filepath;
        buzzSoundCache[filepath] = new buzz.sound(sources);
      }
      
      return buzzSoundCache[filepath];
    };

    function acquireMediaAV (filepath) {
      // body...
      if (filepath in mediaPlayerCache) {
        return mediaPlayerCache[filepath];
      };
      var fs = require('fs');
      var buffer = utilService.toArrayBuffer(fs.readFileSync(filepath));
      var mediaPlayer = AV.Player.fromBuffer(buffer);
      mediaPlayerCache[filepath] = mediaPlayer;
      return mediaPlayer;
    }

    function acquireMediaAsset (filepath) {
      // body...
      if (filepath in assetCache) {
        return assetCache[filepath];
      };
      var fs = require('fs');
      var buffer = utilService.toArrayBuffer(fs.readFileSync(filepath));
      var asset = AV.Asset.fromBuffer(buffer);
      assetCache[filepath] = asset;
      return asset;
    }

    function releaseResource() {
      lodash.values(mediaPlayerCache, function(mediaPlayer) {
        mediaPlayer.stop()
      });
      mediaPlayerCache = {};
      
      lodash.values(assetCache, function(asset) {
        asset.stop()
      });
      assetCache = {};

      lodash.values(buzzSoundCache, function(sound) {
        sound.unbind('loadedmetadata');
      });
      buzzSoundCache = {};
    }

    // Public API here
    return {
      playMp3: function(musicFile) {
        var player = acquireMediaAV(sampleMP3);
        player.togglePlayback();
      },
      playFlac: function(argument) {
        var player = acquireMediaAV(sampleFLAC);
        player.togglePlayback();
      },

      getMetaInfo: function (musicFile, callback) {
        console.log('getMetaInfo:', musicFile);

        var metaInfo, 
          deferred = $q.defer();

        // var sound = acquireMediaBuzzSound(musicFile);
        // console.log('sound.getStateCode(): ', sound.getStateCode());
        // if (sound.getStateCode() === 0) {
        //   sound.bindOnce('loadedmetadata', function() {
        //     metaInfo = {
        //       duration: sound.getDuration()
        //     };
        //     console.log('duration:', metaInfo.duration, musicFile);
        //     deferred.resolve(metaInfo);
        //   });
        // } else {
        //   metaInfo = {
        //     duration: sound.getDuration()
        //   };
        //   deferred.resolve(metaInfo);
        // }
        metaInfo = {
          duration : 4*60
        };
        deferred.resolve(metaInfo);

        return deferred.promise;
      }

       
    };
  }]);