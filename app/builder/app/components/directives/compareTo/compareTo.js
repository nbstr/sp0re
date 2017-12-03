//Directive compareTo
var compareTo = angular.module("compareToModule",[]);

compareTo.directive("compareTo",['$rootScope',function($rootScope){
	return {
		restrict: 'A',
		require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            var watcher=scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });

            scope.$on("$destroy",function(){
                watcher();
            });
        }
	};
}]);

