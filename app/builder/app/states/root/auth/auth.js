if (!app) {
    var app = angular.module(config.app.name);
}

app.controller("AuthController", ['$scope', '$rootScope', function($scope, $rootScope) {

    $scope.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    // CONSTRUCTOR
    $scope.provide('init', function() {
        // $(function() {
        //     $('#form-login').validate()
        // });
    });

    $rootScope.deferredInit($scope.init, true);

}]);