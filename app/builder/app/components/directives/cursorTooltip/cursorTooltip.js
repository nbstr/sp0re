var cursorTooltip = angular.module("cursorTooltipModule", []);

cursorTooltip.directive('cursorTooltip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var x, y;
            var _child = attrs.cursorTooltip ? element[0].querySelector(attrs.cursorTooltip) : this.children[0];
            element.on('mousemove', function(e) {
                x = e.pageX, y = e.pageY;
                _child.style.top = (y + 15) + 'px';
                _child.style.left = (x + 15) + 'px';
            });
        }
    };
})