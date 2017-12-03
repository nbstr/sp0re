//Widget header
var header = angular.module("headerWidget", []);

//constant
header.constant("headerLocal", {
    "template": "html/header.html"
});
//preload template once for all
header.run(['$rootScope', '$http', '$templateCache', 'headerLocal', function($rootScope, $http, $templateCache, local) {
    $http.get(local.template, { cache: $templateCache });
}]);

//controller
header.controller("HeaderController", ['$scope', '$rootScope', '$http', '$timeout', 'atmosphere', 'UX', 'Entry', function($scope, $rootScope, $http, $timeout, atmosphere, UX, Entry) {

    $scope.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    $scope.provide('closeIframe', function() {
        atmosphere.get('closeIframe');
    });

    $scope.provide('switchSide', function() {
        atmosphere.get('switchSide');
    });

    $scope.provide('submitSearch', function(_txt) {
        if (_txt) {
            $rootScope.GLOBAL.page_search_loading = true;
            Entry.search(_txt).then(function(_data) {
                for(var d in _data){
                    _data[d].content = helper.replaceAll(_txt, '<span class="ink-highlight">'+_txt+'</span>', _data[d].content);
                }
                console.log('SEARCH DATA : ', _data);
                $rootScope.GLOBAL.page_search_data = {
                    entries: _data
                };
                $rootScope.GLOBAL.page_search_mode = true;
                $rootScope.GLOBAL.page_search_loading = false;
            }, function(error) {
                $rootScope.GLOBAL.page_search_loading = false;
            });
        } else {
            $rootScope.GLOBAL.page_search_data = {
                entries: []
            };
        }
    });

    $scope.provide('searchInput', {
        focus: function() {
            $rootScope.GLOBAL.page_search_mode = true;
            UX.focus('#header-search-input');
        },
        blur: function() {
            if ($rootScope.GLOBAL.page_search_input == '') {
                $rootScope.GLOBAL.page_search_mode = false;
            }
        },
        switch: function() {
            if (!$rootScope.GLOBAL.page_search_mode) {
                UX.focus('#header-search-input');
            }
            $rootScope.GLOBAL.page_search_mode = !$rootScope.GLOBAL.page_search_mode;
        },
        close: function() {
            $rootScope.GLOBAL.page_search_input = '';
            $rootScope.GLOBAL.page_search_mode = false;
            $rootScope.GLOBAL.page_search_data = {
                entries: []
            };
        }
    });

    //__Constructor
    $scope.provide('init', function() {
        $rootScope.GLOBAL.page_search_mode = false;
        $rootScope.GLOBAL.page_search_input = '';
    });

    $scope.init();
}]);

//directive
header.directive("header", ['$rootScope', 'headerLocal', function($rootScope, local) {
    return {
        restrict: 'A',
        controller: 'HeaderController',
        templateUrl: local.template
    };
}]);