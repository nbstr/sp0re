//Directive ngRepeatCallback
var ngRepeatCallback = angular.module("ngRepeatCallbackModule",[]);

ngRepeatCallback.directive("ngRepeatCallback",['$rootScope','$timeout',function($rootScope,$timeout){
	return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit((attr.ngRepeatCallback && attr.ngRepeatCallback !== 'ng-repeat-callback' && attr.ngRepeatCallback !== 'data-ng-repeat-callback') ? attr.ngRepeatCallback : 'ngRepeatFinished');
                });
            }
        }
    };
}]);

