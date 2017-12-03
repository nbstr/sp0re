var Tracker = angular.module("TrackerModule", []);

Tracker.service("Tracker", ['$rootScope', 'ApiService', '$q', function($rootScope, ApiService, $q) {
    // TRACKER SERVICE
    var self = this;

    self.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    self.provide('post', function(_key, _data) {

    	console.log('tracking : ', _key, _data)

        var q = $q.defer();

        var _post_data = {
            site: $rootScope.GLOBAL.site_info.id,
            url: $rootScope.GLOBAL.location.href,
            page: $rootScope.GLOBAL.page
        };

        for(var e in _data) {
            _post_data[e] = _data[e];
        }

        ApiService.request('trackers.'+_key, _post_data).then(function(data) {
            q.resolve(data);
        });

        return q.promise;

    });

}]);