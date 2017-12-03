//Directive resize
var resize = angular.module("resizeModule",[]);

resize.directive("resize",['$rootScope',function($rootScope){
	return {
			restrict: 'A',
			link: function(scope, element, attrs){
				$rootScope.resizeFunctions=[];
				$(window).resize(function(){
					for(var i=0;i<$rootScope.resizeFunctions.length;i++){
						$rootScope.resizeFunctions[i].call(this);
					} 
				});
				scope.$on("$destroy",function(){
					console.log($rootScope.resizeFunctions);
					$rootScope.resizeFunctions=[];
				})
			}
		}
}]);

