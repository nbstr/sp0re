var UX = angular.module("UXModule", []);

UX.factory("UX", ['$timeout', '$window', function($timeout, $window) {

    var UX = {

        // ███████╗ ██████╗  ██████╗██╗   ██╗███████╗
        // ██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
        // █████╗  ██║   ██║██║     ██║   ██║███████╗
        // ██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
        // ██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
        // ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝
        focus: function(css_selector) {
            // timeout makes sure that it is invoked after any other event has been triggered.
            // e.g. click events that need to run before the focus or
            // inputs elements that are in a disabled state but are enabled when those events
            // are triggered.
            $timeout(function() {
                var element = $(css_selector);
                if (element && !element.is(":focus")) {
                    element.focus();
                }
            });
        }

    };
    return UX;
}]);
