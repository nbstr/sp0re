//Directive ngContent
var ngContent = angular.module("ngContentModule",[]);

ngContent.directive('ngContent', [function() {
  return {
      restrict: 'A',
      link: function($scope, $el, $attrs) {
            var watcher=$scope.$watch($attrs.ngContent, function() {
                var value=$scope.$eval($attrs.ngContent);                    
                if(value!="")
                    $el.attr('content', value);
            });
            $scope.$on("$destroy", function() {
              watcher();
            });
          }

  };
}])

