//Resource CommonApi
var CommonApi = angular.module("CommonApiModule", []);

CommonApi.factory("CommonApi", ['$rootScope', '$q', 'ApiService', 'Upload', function($rootScope, $q, ApiService, Upload) {

    var socialNetwork = {
            provide: function(name, fn) {
                this[name] = safelyProvide(fn);
            }
        },
        CommonApiResource = {
            provide: function(name, fn) {
                this[name] = safelyProvide(fn);
            }
        };

    /****************************************************************************
     *                                                                          *
     * Resource CommonApi                                                       *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    // ██╗███╗   ███╗ █████╗  ██████╗ ███████╗
    // ██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝
    // ██║██╔████╔██║███████║██║ ████╗█████╗  
    // ██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  
    // ██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗
    // ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝

    // ██╗   ██╗██████╗ ██╗      ██████╗  █████╗ ██████╗ 
    // ██║   ██║██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗
    // ██║   ██║██████╔╝██║     ██║   ██║███████║██║  ██║
    // ██║   ██║██╔═══╝ ██║     ██║   ██║██╔══██║██║  ██║
    // ╚██████╔╝██║     ███████╗╚██████╔╝██║  ██║██████╔╝
    //  ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ 

    CommonApiResource.provide('uploadPicture', function(file) {

        var q = $q.defer();

        Upload.upload({
            url: helper.u('picture/users'),
            data: { file: file }
        }).then(function(resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            q.resolve(resp);
        }, function(resp) {
            console.log('Error status: ' + resp.status);
        });

        return q.promise;

    });

    //   ███████╗ ██████╗  ██████╗██╗ █████╗ ██╗     
    //   ██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║     
    //   ███████╗██║   ██║██║     ██║███████║██║     
    //   ╚════██║██║   ██║██║     ██║██╔══██║██║     
    //   ███████║╚██████╔╝╚██████╗██║██║  ██║███████╗
    //   ╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝

    //   ███╗   ██╗███████╗████████╗██╗    ██╗ ██████╗ ██████╗ ██╗  ██╗
    //   ████╗  ██║██╔════╝╚══██╔══╝██║    ██║██╔═══██╗██╔══██╗██║ ██╔╝
    //   ██╔██╗ ██║█████╗     ██║   ██║ █╗ ██║██║   ██║██████╔╝█████╔╝ 
    //   ██║╚██╗██║██╔══╝     ██║   ██║███╗██║██║   ██║██╔══██╗██╔═██╗ 
    //   ██║ ╚████║███████╗   ██║   ╚███╔███╔╝╚██████╔╝██║  ██║██║  ██╗██╗
    //   ╚═╝  ╚═══╝╚══════╝   ╚═╝    ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝

    // SOCIAL AUTHENTICATION CALLBACK // REFRESH VIEW
    socialNetwork.provide('callback', function() {
        if ($rootScope.GLOBAL.facebookWatcher || $rootScope.GLOBAL.googleWatcher) {
            $rootScope.GLOBAL.facebookWatcher = false;
            $rootScope.GLOBAL.googleWatcher = false;
            $rootScope.USER.connected();
        }
    });

    // FACEBOOK AUTHENTICATION
    socialNetwork.provide('facebook', function() {
        $rootScope.GLOBAL.facebookWatcher = true;
        var facebook_redirect_uri = "//www.facebook.com/dialog/oauth?client_id=" + config.app.facebook.client_id + "&response_type=" + config.app.facebook.response_type + "&scope=" + config.app.facebook.scope.join(',') + "&redirect_uri=" + encodeURIComponent(config.app.facebook['redirect_uri' + (config.app.production ? '' : '_dev')]);
        window.open(facebook_redirect_uri, '_blank');
    });

    // GOOGLE AUTHENTICATION
    socialNetwork.provide('google', function() {
        $rootScope.GLOBAL.googleWatcher = true;
        var google_redirect_uri = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + config.app.google.client_id + "&response_type=" + config.app.google.response_type + "&scope=" + config.app.google.scope.join('+') + "&access_type=" + config.app.google.access_type + "&include_granted_scopes=" + config.app.google.include_granted_scopes + "&redirect_uri=" + encodeURIComponent(config.app.google['redirect_uri' + (config.app.production ? '' : '_dev')]);
        window.open(google_redirect_uri, '_blank');
    });

    CommonApiResource.provide('social', socialNetwork);

    return CommonApiResource;

}]);