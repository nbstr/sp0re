var userSession = angular.module("userSessionModule", []);

userSession.service("userSession", ['$rootScope', '$http', '$q', '$timeout', 'sharedData', 'User', 'atmosphere', 'CommonApi', function($rootScope, $http, $q, $timeout, sharedData, User, atmosphere, CommonApi) {
    //userSession Service

    var self = this;

    // AUTHENTICATION
    self.isAuthentified = function() {
        return $rootScope.getData("isAuthentified") ? true : false;
    };

    // USER DATA
    self.nfo = function() {
        return $rootScope.getData("USER") ? $rootScope.getData("USER") : {};
    };

    // APP HANDSHAKE
    self.appHandshake = function(_cb) {
        User.appHandshake().then(function(data) {
            if (data) {
                User.notifications();
                var __user = $rootScope.USER.nfo();
                // status
                if (__user.type === 'creator') {
                    console.log('Welcome back Creator. ♥︎');
                    $rootScope.GLOBAL.status = 'creator';
                } else if (__user.type === 'admin') {
                    console.log('Welcome back Admin. ♥︎');
                    $rootScope.GLOBAL.status = 'admin';
                }
                if (helper.inArray('not_authentified', $rootScope.currentStatePolicy)) {
                    $rootScope.changeState(config.app.home_state, "move-right");
                }
            }
            if (typeof _cb === 'function') {
                _cb(data);
            }
        });
    };

    // SERVER AUTHENTICATION
    self.connected = function(_cb) {
        User.connected().then(function(data) {
            if (data) {
                User.notifications();
                var __user = $rootScope.USER.nfo();
                // status
                if (__user.type === 'creator') {
                    console.log('Welcome back Creator. ♥︎');
                    $rootScope.GLOBAL.status = 'creator';
                } else if (__user.type === 'admin') {
                    console.log('Welcome back Admin. ♥︎');
                    $rootScope.GLOBAL.status = 'admin';
                }
                if (helper.inArray('not_authentified', $rootScope.currentStatePolicy)) {
                    $rootScope.changeState(config.app.home_state, "move-right");
                }
            }
            if (typeof _cb === 'function') {
                _cb(data);
            }
        });
    };

    // CHECK NOTIFICATIONS
    self.notifications = function(_cb) {
        User.notifications().then(_cb);
    };

    // LOGIN
    self.auth = function(_user, _cb, silent_mode) {
        User.login(_user).then(function(data) {
            if (data.error) {
                $rootScope.saveData("isAuthentified", false);
                $rootScope.clearData("USER");
                if (typeof _cb === 'function') {
                    _cb(data.error, data._user);
                }
            } else {
                User.notifications();
                // store data
                $rootScope.saveData("isAuthentified", true);
                $rootScope.saveData("USER", data.user);

                // callback
                if (typeof _cb === 'function') {
                    _cb(data.error, data.user);
                }
            }
            console.log('data', data.user, data._user);

        });
    };

    // LOGIN FACEBOOK
    self.facebookAuth = function() {
        if (config.app.environment === 'web') {
            CommonApi.social.facebook();
        } else {
            atmosphere.get('facebookConnect');
        }
    };

    // LOGIN GOOGLE
    self.googleAuth = function() {
        if (config.app.environment === 'web') {
            CommonApi.social.google();
        } else {
            atmosphere.get('googleConnect');
        }
    };

    // REGISTER
    self.register = function(_user, _cb, silent_mode) {
        User.register(_user).then(function(data) {

            if (data.error) {
                $rootScope.saveData("isAuthentified", false);
                $rootScope.clearData("USER");
                // maybe log error
            }

            if (typeof _cb === 'function') {
                _cb(data.error, data.user);
            }

        });
    };

    // LOGOUT
    self.disconnect = function(_cb) {

        User.disconnect().then(function(logged_out) {
            $rootScope.GLOBAL.status = null;
            $rootScope.saveData("isAuthentified", false);
            $rootScope.clearData("USER");
            if (typeof _cb === 'function') {
                _cb(logged_out);
            } else if (helper.inArray('authentified', $rootScope.currentStatePolicy)) {
                $rootScope.changeState("root.auth", "move-right");
            }
        });

    };

    // RESEND CONFIRMATION EMAIL
    self.resendEmail = function(email, _cb) {
        User.resendConfirmation(email).then(_cb);
    };

    // FORGOT PASSWORD
    self.forgotPassword = function(email, _cb) {
        User.forgotPassword(email).then(_cb);
    };

    // INLINE LOG IN FIRST
    self.ifConnected = function(_cb, _force, __force) {
        // _cb will only be called if user is connected
        // when _force is true, we check with server if user is connected, otherwise, we just use localstorage
        // you can send a second function that can be executed on top of the other one instead of _force
        var notConnectedCb = function() {
            // ACTION IN CASE USER IS NOT CONNECTED
            $rootScope.openModal('inlineAuth', null, function(_action) {
                if (_action === 'register') {
                    $rootScope.closeModal();
                    $rootScope.changeState('root.register', 'move-left');
                }
            });
        };
        if (_force && typeof _force !== 'function' || __force) {
            self.connected(function(_connected) {
                if (_connected && typeof _cb === 'function') {
                    $timeout(_cb);
                } else  if (!_connected) {
                    if (typeof _force === 'function') {
                        _force();
                    }
                    notConnectedCb();
                }
            });
        } else if (self.isAuthentified() && typeof _cb === 'function') {
            $timeout(_cb);
        } else if (!self.isAuthentified()) {
            if (typeof _force === 'function') {
                _force();
            }
            notConnectedCb();
        }
    };

    // INLINE LOG IN FIRST
    self.ifConnectedOrAllowCreate = function(_cb, _force, __force) {

        if ($rootScope.GLOBAL.allow_create_entries) {
            if (typeof _cb === 'function') {
                $timeout(_cb);
            }
        } else {
            self.ifConnected(_cb, _force, __force);
        }

    };

}]);