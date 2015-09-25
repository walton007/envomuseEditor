'use strict';

/**
 * @ngdoc function
 * @name envomusMusicEditor.controller:BoxCtrl
 * @description
 * # BoxCtrl
 * Controller of the envomusMusicEditor
 */
angular.module('envomusMusicEditor')
  .controller('BoxCtrl', ['$scope', '$routeParams', '$sce', '$timeout', 'dateTemplateService', 
  	function ($scope, $routeParams, $sce, $timeout, dateTemplateService) {
  		var controller = this;

  		// get video sources -> controller.videos = 
      var dateTemplate = dateTemplateService.getActiveDateTemplate();
  		$scope.box = dateTemplate.getBox($routeParams.boxId);

      console.log('$scope.box:', $scope.box);
      
  		controller.videos = [];
  		angular.forEach($scope.box.songList, function(song) {
  			var fileUrl = 'file://'+song.path;
  			var oneSource = { sources: [{src: $sce.trustAsResourceUrl(fileUrl), type: 'audio/mpeg'}] };
            controller.videos.push(oneSource); 
        });
 
  		// videogular config
  		controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
  		
  		controller.onPlayerReady = function(API) {
  			console.log(API);
            controller.API = API;
        };

        controller.onCompleteVideo = function() {
            controller.isCompleted = true;

            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

            // controller.setVideo(controller.currentVideo);
        };

        controller.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            sources: controller.videos[0].sources,
            theme: {
            	url: "bower_components/videogular-themes-default/videogular.css"
            },
   //          plugins: {
			// 	poster: "http://www.videogular.com/assets/images/videogular.png"
			// }
        };

        controller.setVideo = function(index) {
            controller.API.stop();
            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 100);
        };
    
      $scope.changeStart = function(){
        var mEnd = new moment($scope.box.endTm);
        var mStart = new moment($scope.box.startTm);

        if(mEnd.isBefore(mStart))
          {
           $scope.box.endTm = $scope.box.startTm;
          }
      };

  }]);
