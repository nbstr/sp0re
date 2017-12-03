//Directive autoHeight
var autoHeight = angular.module("autoHeightModule",[]);

autoHeight.directive("autoHeight",["$timeout",function($timeout){
	var min_height = 42;
	return {
		restrict: 'A',
		link: function(scope,element,attrs) {
			$timeout(function(){

				if(!attrs.ngTrim){
					attrs.ngTrim = "false";
				}

	            var watchFunction=function(){
	                element.height(0);
	                element.css("height",Math.max(element["0"].scrollHeight, min_height)+"px");
	            }
	            
	            var watcher=scope.$watch(attrs.ngModel,watchFunction);
	            scope.$on("$destroy",function(){
	            	watcher();
	            });

       		});
		}
	};
}]);

