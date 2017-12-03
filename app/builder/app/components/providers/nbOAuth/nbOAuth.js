//Provider nbOAuth
var nbOAuth = angular.module("nbOAuthModule",[]);

nbOAuth.config(["$httpProvider",function($httpProvider){
	$httpProvider.interceptors.push("nbOAuthInterceptor");
}]);

nbOAuth.provider("nbOAuth",[function(){
	var self=this;

	var defaults = {
        baseUrl: null,
        clientId: null,
        clientSecret: null,
        grantPath: "/oauth2/token",
        revokePath: "/oauth2/revoke"
    };
    var requiredKeys = [ "baseUrl", "clientId", "grantPath", "revokePath" ];

	var config;
    this.configure = function(params) {
        if (config) {
            throw new Error("Already configured.");
        }
        if (!(params instanceof Object)) {
            throw new TypeError("Invalid argument: `config` must be an `Object`.");
        }
        config = angular.extend({}, defaults, params);
        angular.forEach(requiredKeys, function(key) {
            if (!config[key]) {
                throw new Error("Missing parameter: " + key + ".");
            }
        });
        if ("/" === config.baseUrl.substr(-1)) {
            config.baseUrl = config.baseUrl.slice(0, -1);
        }
        if ("/" !== config.grantPath[0]) {
            config.grantPath = "/" + config.grantPath;
        }
        if ("/" !== config.revokePath[0]) {
            config.revokePath = "/" + config.revokePath;
        }
        return config;
    };

	this.$get = ['$http','nbOAuthToken', function($http,OAuthToken) {
		var nbOAuth=function(){
			function nbOAuth(){};
			nbOAuth.prototype.getAccessToken=function(user,options){
				if (!user || !user.username || !user.password) {
                    throw new Error("`user` must be an object with `username` and `password` properties.");
                }
                var data = {
                    client_id: config.clientId,
                    grant_type: "password",
                    username: user.username,
                    password: user.password
                };
                if (null !== config.clientSecret) {
                    data.client_secret = config.clientSecret;
                }
                data = queryString.stringify(data);
                options = angular.extend({
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }, options);
                return $http.post("" + config.baseUrl + "" + config.grantPath, data, options).then(function(response) {
                    OAuthToken.setToken(response.data);
                    return response;
                });
			},
			nbOAuth.prototype.getRefreshToken=function() {
                var data = {
                    client_id: config.clientId,
                    grant_type: "refresh_token",
                    refresh_token: OAuthToken.getRefreshToken()
                };
                if (null !== config.clientSecret) {
                    data.client_secret = config.clientSecret;
                }
                data = queryString.stringify(data);
                var options = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                };
                return $http.post("" + config.baseUrl + "" + config.grantPath, data, options).then(function(response) {
                    OAuthToken.setToken(response.data);
                    return response;
                });
            },
            nbOAuth.prototype.revokeToken=function() {
                var data = queryString.stringify({
                    token: OAuthToken.getRefreshToken() ? OAuthToken.getRefreshToken() : OAuthToken.getAccessToken()
                });
                var options = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                };
                return $http.post("" + config.baseUrl + "" + config.revokePath, data, options).then(function(response) {
                    OAuthToken.removeToken();
                    return response;
                });
            }
            return nbOAuth;
        }();
		return new nbOAuth();
	}];
}]);

nbOAuth.provider("nbOAuthToken",[function(){
	var self=this;

	var config = {
        name: "token"
    };
    this.configure = function(params) {
        if (!(params instanceof Object)) {
            throw new TypeError("Invalid argument: `config` must be an `Object`.");
        }
        angular.extend(config, params);
        return config;
    };

	this.$get = ['nbStorage', function($storage) {
		var nbOAuthToken=function(){
			function nbOAuthToken(){}
			nbOAuthToken.prototype.setToken=function(data){
				$storage.saveData(config.name,data);
			},
	        nbOAuthToken.prototype.getToken=function(){
	        	return $storage.getData(config.name);
	        },
	        nbOAuthToken.prototype.getAccessToken=function(){
	        	return this.getToken() ? this.getToken().access_token : undefined;
	        },
	        nbOAuthToken.prototype.getTokenType=function(){
	        	return this.getToken() ? this.getToken().token_type : undefined;
	        }
	        nbOAuthToken.prototype.getAuthorizationHeader=function(){
	        	if (!(this.getTokenType() && this.getAccessToken())) {
                    return;
                }
                return "" + (this.getTokenType().charAt(0).toUpperCase() + this.getTokenType().substr(1)) + " " + this.getAccessToken();
	        },
	        nbOAuthToken.prototype.getRefreshToken=function(){
	        	return this.getToken() ? this.getToken().refresh_token : undefined;
	        },
	        nbOAuthToken.prototype.removeToken=function(){
	        	$storage.clearData(config.name);
	        }
	        return nbOAuthToken;
		}()
		return new nbOAuthToken();
	}];
}]);

nbOAuth.factory("nbOAuthInterceptor",['$q','$rootScope','nbOAuthToken',function($q,$rootScope,OAuthToken){
	// console.log(OAuthToken);
	return {
        request: function(config) {
            if (OAuthToken.getAuthorizationHeader()) {
                config.headers = config.headers || {};
                config.headers.Authorization = OAuthToken.getAuthorizationHeader();
            }
            return config;
        },
        responseError: function(rejection) {
            // if (400 === rejection.status && rejection.data && ("invalid_request" === rejection.data.error || "invalid_grant" === rejection.data.error)) {
            //     OAuthToken.removeToken();
            //     $rootScope.$emit("oauth:error", rejection);
            // }
            // if (401 === rejection.status && (rejection.data && "invalid_token" === rejection.data.error) || rejection.headers("www-authenticate") && 0 === rejection.headers("www-authenticate").indexOf("Bearer")) {
            //     $rootScope.$emit("oauth:error", rejection);
            // }
            return $q.reject(rejection);
        }
    };
}]);

