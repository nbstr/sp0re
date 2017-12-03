//Directive scrollControll
var scrollControll = angular.module("scrollControllModule",[]);

scrollControll.directive("scrollControll",['$timeout','nbStorage','$state','$rootScope',function($timeout,$storage,$state,$rootScope){
	return {
		restrict: 'A',
		link: function(scope,element,attrs) {
			//variables
			var namespaceScroll, 
			scrollWatcher, //watcher for asyn loading
			resetStateName=attrs.resetState || "frame.mainmenu", //state when the scroll historic has to be deleted
			scrollWrapper=attrs.wrapper || ".page-wrapper, .scroll-wrapper", //scrollWrapper (ex: body, page-wrapper, ...)
			loadingVar=attrs.loadingVar || "isLoading"; //$rootScope variable handling loading
			
			//creation of a namespace
			namespaceScroll="scrollTransitionChange";
			$rootScope[namespaceScroll]={};

			$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
				var wrapper=$(scrollWrapper);
				if(wrapper.length>1){
					wrapper=$(wrapper[0]);
				}
				if(scrollWatcher)
					scrollWatcher();
				$rootScope[namespaceScroll][fromState.name+"_state"]=wrapper.scrollTop();
			});
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
				if(toState.noScrollControll)
					return false;
				//at most twice
				var numTry=0;
				$timeout(function(){
					scrollWatcher=$rootScope.$watch(loadingVar,function(value){
						if(value){
							return false;
						}

						var scrollPosition=$rootScope[namespaceScroll][toState.name+"_state"];
						if(scrollPosition>0){
							numTry++;
							$timeout(function(){
								var wrapper=$(scrollWrapper);
								if(wrapper.length>1){
									wrapper=$(wrapper[0]);
								}
								wrapper.scrollTop(scrollPosition);
							},config.app.delay_transition+50);
						}
						if(numTry==2){
							$timeout.cancel(timeout);
							scrollWatcher();
						}
					});
					if(toState.name==resetStateName){
						//reinitialisation
						$rootScope[namespaceScroll]={};
					}
					var timeout=$timeout(function(){
						if(numTry>0)
							scrollWatcher();
					},4000)
				});
			});
		}
	};
}]);

