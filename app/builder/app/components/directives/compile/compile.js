//Directive compile
var compile = angular.module("compileModule",[]);

compile.directive("compile",['$compile',function($compile){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var watchFunc=scope.$watch(attrs.compile,function(value) {
                    if(value){
                        element.html(value);
                        if(attrs.compile){
                            $compile(element.contents())(scope);
                        }
                    }
                }
            );
            scope.$on("$destroy", function() {
                watchFunc();
            });
        }
    };
}]);

