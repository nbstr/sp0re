var ApiService = angular.module("ApiServiceModule", []);

ApiService.service("ApiService", ['$rootScope', '$http', '$q', '$timeout', function($rootScope, $http, $q, $timeout) {
    //ApiService Service
    var self = this;

    self.default = {
        error_message: $rootScope.getContent('error.default'),
        user_logout: function() {
            $rootScope.UserMethod.logout();
        },
        headers: {
            "Content-Type": "application/json",
        },
        routes: api_routes ? api_routes : { config: {} }
    };

    self.return = {
        url: function(url, param) {
            // returns base url added to url
            return (self.default.routes.config.productionServer ? self.default.routes.config.production.url : self.default.routes.config.development.url) + '/' + url + (param ? '/' + param : '');
        },
        baseUrl: function(url) {
            // returns base url added to url
            return (self.default.routes.config.productionServer ? self.default.routes.config.production.url : self.default.routes.config.development.url) + (url ? '/' + url : '');
        },
        apiError: function(r) {
            // condition to have an api authentication error
            return (r.error && r.error.code == "authentication");
        },
        serviceUrl: function(service, routeObject) {
            // first check if exists in specific environment
            var url;
            if (routeObject.serv) {
                if (self.default.routes.config[(self.default.routes.config.productionServer) ? 'production' : 'development'][service]) {

                } else if (self.default.routes.config.common[service] !== undefined) {
                    return self.default.routes.config.common[service] + '/' + routeObject.url;
                } else {
                    console.log('error : ', 'base url undefined');
                    return '';
                }
            } else {
                return self.return.url(routeObject.url);
            }
        },
        urlParams: function(find, replace, str) {
            if (!str) {
                return '';
            }
            return str.split(find).join(replace);
        },
        cleanObject: function(data) {
            var output = {};
            for (var s in data) {
                // la valeur existe
                if (data[s] !== undefined && data[s] !== null) {
                    // ce n'est pas un objet, sinon récurrence
                    if (helper.is('object', data[s])) {
                        output[s] = self.return.cleanObject(data[s]);
                    } else if (helper.is('array', data[s]) && data[s] !== [] && data[s].length > 0) {
                        for (var k in data[s]) {
                            if (data[s][k] !== undefined && data[s][k] !== null) {
                                output[s] = data[s];
                                break;
                            }
                        }
                    } else {
                        output[s] = data[s];
                    }
                }
            }
            return output;
        },
    };

    /*
        @param $rootScope.User
     */
    self.request = function(options, data, errorFn) {
        /*
        |    we'll always have an answer in this format :
        |
        |    {
        |        success: {true|false},
        |        data: {data},
        |        error: {errorMessage if success == false}
        |    }
        |
         */

        if (typeof options === 'string') {
            options = self.options(options, data);
        }

        var q = $q.defer();

        if (options === null ||  options === undefined) {
            
            q.resolve({
                success: false,
                serverError: false,
                payload: {},
                nfo: 'no data set to http request'
            });

        } else {
            $http(options).then(function(r) {

                if (!r.data || !r.data.success) {
                    // console.log('api error', r);
                    if (self.return.apiError(r.data) && typeof self.default.user_logout === 'function') {
                        self.default.user_logout(r.data);
                    }
                    q.resolve(r.data);
                } else {
                    // console.log('api success', r);
                    q.resolve(r.data);
                }

            }, function(r) {

                if (typeof errorFn === 'function') {
                    errorFn();
                } else {
                    // console.log('api server error', r);
                    $rootScope.openModal('serverError');
                }
                q.resolve({
                    success: false,
                    serverError: true,
                    payload: r.data,
                    nfo: self.default.error_message
                });
            });
        }

        return q.promise;
    };

    self.options = function(route, data) {

        // manage nesting — only one layer
        if (route.indexOf('.') > -1) {
            parent = route.split('.')[0];
            route = route.split('.')[1];
            base = self.default.routes[parent];
        } else {
            base = self.default.routes;
        }

        // check if route exists
        // required : url, method
        if (base && base[route] && base[route].url && base[route].method) {

            // init object
            var options = {
                url: '',
                method: base[route].method,
                headers: self.default.headers
            };

            // url
            options.url = self.return.serviceUrl(base[route].serv, base[route]);

            // url params
            if (options.url.indexOf(':') > -1) {
                for (var key in data) {
                    if (data && data[key] !== undefined && data[key] !== null && options.url.indexOf(':' + key) > -1) {
                        options.url = self.return.urlParams(':' + key, data[key], options.url);
                    }
                }
            }

            // params or data
            if (['GET', 'DELETE'].indexOf(base[route].method) > -1 && data) {
                options.params = self.return.cleanObject(data);
            } else if (data) {
                options.data = self.return.cleanObject(data);
            }

            // headers
            if (base[route].headers) {
                for (var h in base[route].headers) {
                    options.headers[h] = base[route].headers[h];
                }
            }

            return options;
        } else {
            return null;
        }
    };
}]);