//Directive nbSameHeight
var nbSameHeight = angular.module("nbSameHeightModule",[]);

nbSameHeight.directive("nbSameHeight",['$rootScope','$timeout',function($rootScope,$timeout){
	return {
        restrict: 'A',
        link: function(scope, element, attrs){
        	var rapp=1;
        	var sizeFunc;
        	var rapp_calculator=function(){
        		if(attrs.rappResp && !isNaN(attrs.rappResp) && $(window).innerWidth()<=config.app.phone_limit){
	        		rapp=attrs.rappResp;
	        	}
	        	else if(attrs.nbSameHeight && !isNaN(attrs.nbSameHeight))
	        		rapp=attrs.nbSameHeight;
        	}
        	if(attrs.comp){
        		sizeFunc=function(){
        			rapp_calculator();
        			var comp=$(attrs.comp);
	            	element.height( Math.floor(comp.height()));
	            }
                var delay=0;
                if(attrs.delay){
                    delay=attrs.delay;
                }
	            $timeout(function(){
	            	sizeFunc()
	            },delay);
        	}
        	else{
        		sizeFunc=function(){
        			rapp_calculator();
	            	element.height(Math.floor(element.width()*rapp));
	            }
	            sizeFunc();
	        }
            $rootScope.resizeFunctions.push(sizeFunc);
        }
    }
}]);

