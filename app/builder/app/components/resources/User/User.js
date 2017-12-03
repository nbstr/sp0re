//Resource User
var User = angular.module("UserModule", []);

User.factory("User", ['$rootScope', 'ApiService', '$q', 'sharedData', 'UserNotifications', 'atmosphere', 'Upload', function($rootScope, ApiService, $q, sharedData, UserNotifications, atmosphere, Upload) {

    var UserResource = {
        last_connection: null,
        last_connection_timeout: 1,
        provide: function(name, fn) {
            this[name] = safelyProvide(fn);
        }
    };

    /****************************************************************************
     *                                                                          *
     * Resource User                                                            *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    UserResource.provide('connected', function(data) {

        var q = $q.defer();

        // DONT CHECK EVERYTIME, MIN EVERY 10 SECONDS
        if (!UserResource.last_connection || ((new Date()).getTime() - (UserResource.last_connection ? UserResource.last_connection : 0)) > 1000 * UserResource.last_connection_timeout) {
            UserResource.last_connection = (new Date()).getTime();

            ApiService.request('user.me').then(function(data) {

                // USER IS CONNECTED
                var connected = (data && data.success);

                $rootScope.saveData("isAuthentified", connected);
                $rootScope.saveData("USER", connected ? data.result : null);

                q.resolve(connected);

            });

        } else {
            q.resolve($rootScope.USER.isAuthentified());
        }

        return q.promise;

    });

    UserResource.provide('appHandshake', function(data) {

        var q = $q.defer();

        // DONT CHECK EVERYTIME, MIN EVERY 10 SECONDS
        if (!UserResource.last_connection || ((new Date()).getTime() - (UserResource.last_connection ? UserResource.last_connection : 0)) > 1000 * UserResource.last_connection_timeout) {
            UserResource.last_connection = (new Date()).getTime();

            ApiService.request('user.handshake').then(function(data) {

                console.log('HANDSHAKE');

                // USER IS CONNECTED
                var connected = (data && data.success);

                $rootScope.saveData("isAuthentified", connected);
                $rootScope.saveData("USER", connected ? data.result : null);

                q.resolve(connected);

            });

        } else {
            q.resolve($rootScope.USER.isAuthentified());
        }

        return q.promise;

    });

    UserResource.provide('login', function(user) {

        if (!user) {
            user = {};
        } else if (!user.email) {
            user.email = '';
        }

        user.email = user.email.toLowerCase();

        var q = $q.defer();

        ApiService.request('user.login', {
            email: user.email,
            password: user.password
        }).then(function(data) {

            var logged_in = (data && data.success);
            var catch_error = true;

            // MANAGE ERRORS
            if (!logged_in) {

                for (var e in data.errors) {
                    if (data.errors[e].type === 'email_not_confirmed') {
                        // EMAIL NOT CONFIRMED
                        sharedData.saveData('tmp_auth', user);
                        catch_error = 'email_not_confirmed';
                        break;

                    } else if (data.errors[e].type === 'login_failed') {
                        // WRONG CREDENTIALS
                        catch_error = 'login_failed';
                        break;

                    }

                }

            } else {
                var __user = data.result;
                // status
                if (__user.type === 'creator') {
                    console.log('Welcome back Creator. ♥︎');
                    $rootScope.GLOBAL.status = 'creator';
                } else if (__user.type === 'admin') {
                    console.log('Welcome back Admin. ♥︎');
                    $rootScope.GLOBAL.status = 'admin';
                }
            }

            q.resolve({
                user: logged_in ? data.result : null,
                error: logged_in ? null : catch_error
            });

        });

        return q.promise;

    });

    UserResource.provide('register', function(user) {

        if (!user) {
            user = {};
        } else if (!user.email) {
            user.email = '';
        }

        user.email = user.email.toLowerCase();

        var q = $q.defer();

        ApiService.request('user.register', {
            email: user.email,
            password: user.password,
            password_repeat: user.password,
            first_name: user.first_name,
            last_name: user.last_name
        }).then(function(data) {

            if (data && data.success) {
                console.log('success : ', data.result);
            } else {
                console.log('error : ', data.errors)
            }

            var registered = (data && data.success);
            var catch_error = true;

            // MANAGE ERRORS
            if (!registered) {

                for (var e in data.errors) {
                    if (data.errors[e].type === 'email_not_confirmed') {
                        // EMAIL NOT CONFIRMED
                        sharedData.saveData('tmp_auth', user);
                        catch_error = 'email_not_confirmed';
                        break;

                    } else if (data.errors[e].type === 'login_failed') {
                        // WRONG CREDENTIALS
                        catch_error = 'login_failed';
                        break;

                    }

                }

            }

            q.resolve({
                user: registered ? data.result : null,
                error: registered ? null : catch_error
            });

        });

        return q.promise;

    });

    UserResource.provide('update', function(data) {

        var q = $q.defer();

        ApiService.request('user.update', data).then(function(data) {
            if (data && data.success) {

                $rootScope.saveData("isAuthentified", true);
                $rootScope.saveData("USER", data.result);

                q.resolve(data.result);
            } else {
                $rootScope.showErrorModal('We could not update your information');
                q.reject();
            }
        });

        return q.promise;

    });

    UserResource.provide('notifications', function() {

        var q = $q.defer();

        ApiService.request('user.notifications', {
            limit: 50
        }).then(function(data) {
            // console.log('notifications : ', data);
            var notifications;
            if (data && data.success) {
                notifications = UserNotifications.formatNotifications(data.result);
            }

            if (notifications && notifications.notifications) {
                $rootScope.USER_NOTIFICATIONS.notifications = notifications.notifications;
                $rootScope.USER_NOTIFICATIONS.unreads = notifications.unreads;
                q.resolve(notifications);
            } else {
                console.log('We could not get the notifications');
                q.reject();
            }
        });

        return q.promise;

    });

    UserResource.provide('checkAndUpdateLastNotificationReads', function() {

        var q = $q.defer();

        ApiService.request('user.update_notifications').then(function(data) {
            console.log('last read notifications : ', data);
            q.resolve(true);
        });

        return q.promise;

    });

    UserResource.provide('resendConfirmation', function(email) {

        var q = $q.defer();

        email = email.toLowerCase();

        ApiService.request('user.resendEmail', {
            email: email
        }).then(function(data) {

            var email_sent = (data && data.success);

            $rootScope.showSuccessModal(email_sent ? 'We just sent you the confirmation email. You can check your inbox.' : 'An error occured');

            q.resolve(email_sent);

        });

        return q.promise;

    });

    UserResource.provide('forgotPassword', function(email) {

        var q = $q.defer();

        email = email.toLowerCase();

        ApiService.request('user.forgotPassword', {
            email: email
        }).then(function(data) {

            var email_sent = (data && data.success);

            $rootScope.showSuccessModal(email_sent ? 'We just sent you an email with a new password. Please change it as soon as you can.' : 'An error occured');

            q.resolve(email_sent);

        });

        return q.promise;

    });

    UserResource.provide('disconnect', function() {

        var q = $q.defer();

        ApiService.request('user.logout').then(function(data) {

            var logout = (data && data.success);

            // ICON
            atmosphere.get('action:hey');

            q.resolve(logout);

        });

        return q.promise;

    });

    UserResource.provide('uploadPicture', function(file) {

        var q = $q.defer();

        if (file) {
            Upload.upload({
                url: helper.u('picture/users'),
                data: { file: file }
            }).then(function(resp) {
                // update picture
                if (resp && resp.data && resp.data.result) {
                    var user = $rootScope.getData("USER");
                    user.picture = resp.data.result.picture;
                    $rootScope.saveData("USER", user);
                }

                q.resolve(resp);
            }, function(resp) {
                console.log('Error status: ' + resp.status);
            });
        } else {
            q.reject();
        }

        return q.promise;

    });

    UserResource.provide('sitesManaged', function() {

        var q = $q.defer();

        ApiService.request('user.sites_managed').then(function(data) {

            q.resolve(data);

        });

        return q.promise;

    });

    UserResource.provide('manageSite', function(_domain) {

        var q = $q.defer();

        ApiService.request('user.site_manage', {
            domain: _domain
        }).then(function(data) {
            q.resolve(data);
        });

        return q.promise;

    });

    UserResource.provide('verifyManagedSite', function(id) {

        var q = $q.defer();

        ApiService.request('user.verify_site_managed', {
            id: id
        }).then(function(data) {
            q.resolve(data);
        });

        return q.promise;

    });

    UserResource.provide('getUserRole', function(id) {

        var q = $q.defer();

        ApiService.request('user.user_role', {
            id: id
        }).then(function(data) {
            q.resolve(data);
        });

        return q.promise;

    });

    UserResource.provide('updateUserRole', function(data) {

        var q = $q.defer();

        ApiService.request('user.update_user_role', data).then(function(_data) {
            q.resolve(_data);
        });

        return q.promise;

    });

    UserResource.provide('updateSite', function(data) {

        var q = $q.defer();

        ApiService.request('site.update', data).then(function(_data) {
            q.resolve(_data);
        });

        return q.promise;

    });

    return UserResource;

}]);