//Directive noAnimatedClass
var noAnimatedClass = angular.module("noAnimatedClassModule",[]);

noAnimatedClass.directive("noAnimatedClass",['$rootScope',function($rootScope){
    return {
        restrict: 'A',
        link: function(scope,element,attrs) {
            $rootScope.$watch(attrs.noAnimatedClass,function(newVal,oldVal){
                if(oldVal)
                    element.removeClass(oldVal);
                if(newVal)
                    element.addClass(newVal);
            });
        }
    };
}]);

