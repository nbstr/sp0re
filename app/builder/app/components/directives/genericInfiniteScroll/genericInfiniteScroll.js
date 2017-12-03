//Directive genericInfiniteScroll
var genericInfiniteScroll = angular.module("genericInfiniteScrollModule", []);

/*

Parameters 

Take a config object of the scope

generic-infinite-scroll="config_object"

config_object:{
	scopeDataName //name of the variable created (default: data)
	config //a html config object (url, ...) [REQUIRED]
	timeoutFirstApi //Timeout for the first api call (default to config.app.dom.anim_time or 400)
	attachLoading //disable the default loading of the intercepted
	dataResultName //name of the array of results in scopeDataName (default: data_)
	customLoading //custom loading function
	treatmentRes // treat result when they are get
	postTreatment //treat all the results after a api call (previous included)
	fake //Bool
	fake_data //required with fake = true
}


create a variable in the scope => 'scopeDataName' (default to data)
the object is as follow

data:{
	"data_" // the array of results
	"isChargingData" // is currently loading data
	"loaded" // at least one api has been called
	"continueLoad" // some data still need to be charged
}

*/
genericInfiniteScroll.directive("genericInfiniteScroll", ['$rootScope', '$http', '$timeout', '$q', '$injector', 'config', function($rootScope, $http, $timeout, $q, $injector, config_app) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            // ELEMENT
            var raw, scroller;
            if (attrs.genericInfiniteScrollElement && $(attrs.genericInfiniteScrollElement)) {
                scroller = $(attrs.genericInfiniteScrollElement);
                raw = scroller[0];
            } else {
                raw = element[0];
                scroller = element;
            }
            //get the corresponding resource !!!
            var watchFunc = function(config) {

                if (!config) {
                    return false;
                }

                var scope_data_name = config.scopeDataName || "data";
                var attach_loading = config.attachLoading || false;
                var timeout_first_api = config.timeoutFirstApi || config_app.app.dom.anim_time || 400;

                var http_config = {};

                if (!config.fake) {
                    http_config = helper.clone(config.config);
                    if (!http_config.url) {
                        alert("provide an url !");
                    }
                    if (!http_config.method)
                        http_config.method = "GET";
                }
                //if(!scope[scope_data_name])
                scope[scope_data_name] = {};

                var offset = 0;
                var first = true;
                //preloaded data (using sharedData for example)
                var data_result_name = config.dataResultName || "data_";

                if (config.preloaded_data && config.preloaded_data.length > 0) {
                    scope[scope_data_name][data_result_name] = helper.clone(config.preloaded_data);
                    offset = config.preloaded_data.length;
                }


                if (!http_config.data)
                    http_config.data = {};
                //default limit post
                if (!http_config.data["limit"])
                    http_config.data["limit"] = 10;

                http_config.data.offset = offset;

                if (!http_config.params)
                    http_config.params = {};
                //default limit get
                if (!http_config.params["limit"])
                    http_config.params["limit"] = 10;
                http_config.params.offset = offset;

                scope[scope_data_name].continueLoad = true;

                //pagination
                var next_json;
                //load data from the server (query functions)
                var load = function(data_result_name) {

                	console.log('loading !')

                    if (!scope[scope_data_name].continueLoad)
                        return false;
                    if (scope[scope_data_name].isCharginData)
                        return false;
                    scope[scope_data_name].isCharginData = true;

                    if (!data_result_name)
                        data_result_name = "data_";
                    if (!scope[scope_data_name][data_result_name])
                        scope[scope_data_name][data_result_name] = [];
                    var deferred = $q.defer();
                    if (typeof config.customLoading === 'function') {
                        config.customLoading(true)
                    } else if (attach_loading) {
                        $rootScope.backgroundLoading();
                    }
                    // scope[scope_data_name].loading=true;
                    var callback = function(results) {
                        if (typeof config.customLoading === 'function') {
                            config.customLoading(false)
                        } else if (attach_loading) {
                            $rootScope.resetLoading();
                        }

                        //  scope[scope_data_name].loading=false;
                        if (!results.error) {
                            //offset get/post (same value)
                            if (results.length < http_config.params["limit"]) {
                                scope[scope_data_name].continueLoad = false;
                            }

                            var res = helper.clone(results);
                            //treatment res
                            if (typeof config.treatmentRes === 'function') {
                                res = config.treatmentRes(res);
                            }

                            if (scope[scope_data_name][data_result_name].length == 0) {
                                scope[scope_data_name][data_result_name] = res;
                            } else {
                                for (var i = 0; i < res.length; i++) {
                                    scope[scope_data_name][data_result_name].push(res[i]);
                                }
                            }
                            http_config.params["offset"] += http_config.params["limit"];
                            http_config.data["offset"] += http_config.data["limit"];
                            //post treatment general
                            if (typeof config.postTreatment === 'function') {
                                config.postTreatment(scope[scope_data_name][data_result_name]);
                            }

                            deferred.resolve(scope[scope_data_name][data_result_name]);
                            if (!scope[scope_data_name].loaded) {
                                scope[scope_data_name].loaded = true;
                            }
                        } else {
                            deferred.reject();
                        }
                        if (config.fake && scope[scope_data_name][data_result_name].length > 100) {
                            scope[scope_data_name].continueLoad = false;
                        }
                        scope[scope_data_name].isCharginData = false;
                    };
                    if (!config.fake) {
                        http_call = function() {
                                $http(http_config).then(function(resp) {
                                    //handle pagination
                                    callback(resp.data.result);
                                }, function(error) {
                                    if (config.customLoading) {
                                        config.customLoading(false)
                                    } else if (attach_loading) {
                                        $rootScope.resetLoading();
                                    }
                                    //scope[scope_data_name].loading=false;
                                    if (!scope[scope_data_name].loaded) {
                                        scope[scope_data_name].loaded = true;
                                    }
                                });
                            }
                            //Only for the first call to avoid 
                        if (first) {
                            first = false;
                            $timeout(http_call, timeout_first_api);
                        } else
                            http_call();
                    } else {
                        if (!attach_loading) {
                            $rootScope.loading();
                        }
                        $timeout(function() {
                            var resp = config.fake_data || [];
                            callback(resp);
                            if (!attach_loading)
                                $rootScope.loaded();
                        }, 1000)
                    }
                    return deferred.promise;
                };
                //first load
                $timeout(function() {
                    load(data_result_name);
                });

                //to be sure
                scroller.off('scroll');

                $timeout(function() {
                    scroller.on('scroll', function(e) {
                        // console.log('scrolling', {
                        //     inner: scroller.innerHeight(),
                        //     scrollTop: scroller.scrollTop(),
                        //     sum: scroller.scrollTop() + scroller.innerHeight(),
                        //     raw: raw.scrollHeight,
                        //     diff: (scroller.scrollTop() + scroller.innerHeight()) - (raw.scrollHeight)
                        // });
                        if (scope[scope_data_name][data_result_name] && scope[scope_data_name][data_result_name].length > 0 && ((scroller.scrollTop() + scroller.innerHeight()) >= (raw.scrollHeight))) {
                            $timeout(function() {
                                var loadPromise = load(data_result_name);
                            });
                        }
                    });
                });


            }
            var watcher = scope.$watch(attrs.genericInfiniteScroll, watchFunc, true);
            scope.$on("$destroy", function() {
                watcher();
                scroller.off('scroll');
            });
        }
    };
}]);