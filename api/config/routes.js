var _ROUTES = {


    // ████████╗███████╗███████╗████████╗
    // ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝
    //    ██║   █████╗  ███████╗   ██║   
    //    ██║   ██╔══╝  ╚════██║   ██║   
    //    ██║   ███████╗███████║   ██║   
    //    ╚═╝   ╚══════╝╚══════╝   ╚═╝   

    'get /test': 'TestController.get',
    // 'get /test500': 'TestController.e500',
    // 'get /test/logs': 'TestController.testAllLogs',
    // 'post /test': 'TestController.post',
    // 'delete /test': 'TestController.delete',
    // 'patch /test': 'TestController.patch',
    // 'put /test': 'TestController.put',
    // 'get /testmail': 'TestController.mail',
    // 'get /test/webhook': 'TestController.facebookWebhook',

    // 'post /addpoints': 'EntryController.addPoints',

    // ██████╗ ██╗████████╗████████╗██████╗ ███████╗██╗  ██╗
    // ██╔══██╗██║╚══██╔══╝╚══██╔══╝██╔══██╗██╔════╝╚██╗██╔╝
    // ██████╔╝██║   ██║      ██║   ██████╔╝█████╗   ╚███╔╝ 
    // ██╔══██╗██║   ██║      ██║   ██╔══██╗██╔══╝   ██╔██╗ 
    // ██████╔╝██║   ██║      ██║   ██║  ██║███████╗██╔╝ ██╗
    // ╚═════╝ ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝

    'get /b/getmarketsummaries': 'BtrexController.getmarketsummaries',
    'get /b/getorderbook': 'BtrexController.getorderbook',
    'get /b/getbalances': 'BtrexController.getbalances',
    'get /b/getticker': 'BtrexController.getticker',
    'get /b/getorderhistory': 'BtrexController.getorderhistory',


    // ██╗   ██╗███████╗███████╗██████╗ 
    // ██║   ██║██╔════╝██╔════╝██╔══██╗
    // ██║   ██║███████╗█████╗  ██████╔╝
    // ██║   ██║╚════██║██╔══╝  ██╔══██╗
    // ╚██████╔╝███████║███████╗██║  ██║
    //  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝

    'post /login': "ConnectionController.login",

    'get /login/facebook': "ConnectionController.loginFacebook",
    'get /login/facebook/callback': "ConnectionController.loginFacebookCallback",

    'get /login/google': "ConnectionController.loginGoogle",
    'get /login/google/callback': "ConnectionController.loginGoogleCallback",

    'get /logout': "ConnectionController.logout",

    'get /users/checkEmail': "UserController.checkEmail",
    'post /users/resendConfirmation': "UserController.resendConfirmation",

    'post /password/change': "UserController.changePassword",
    'post /password/reset': "UserController.resetPassword",

    'post /users': "UserController.create",

    'get /handshake': "UserController.handshake",
    'get /me': "UserController.me",
    'patch /me': "UserController.update",
    'delete /me': "UserController.softDelete",

    'post /picture/users': "UserController.uploadUserPicture",
    'get /picture/:user_id': "UserController.getPicture",

    //  █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗
    // ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║
    // ███████║██║  ██║██╔████╔██║██║██╔██╗ ██║
    // ██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║
    // ██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║
    // ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝

    // 'get /makeCreator': "UserController.makeCreator",
    // 'get /makeAdmin': "UserController.makeAdmin",
    // 'get /user/site/managed': "UserController.getSitesManaged",
    // 'post /user/site/manage': "UserController.manageSite",
    // 'get /user/site/verify/:id': "UserController.verifySite",
    // 'get /user/role/:id': "UserController.userRole",
    // 'put /user/role/:id': "UserController.updateUserRole",


    // ██████╗ ██╗   ██╗ ██████╗ 
    // ██╔══██╗██║   ██║██╔════╝ 
    // ██████╔╝██║   ██║██║ ████╗
    // ██╔══██╗██║   ██║██║   ██║
    // ██████╔╝╚██████╔╝╚██████╔╝
    // ╚═════╝  ╚═════╝  ╚═════╝ 

    // 'post /bug': "BugController.bug",
    // 'get /bug': "BugController.bugImg",


    // ██╗      ██████╗  ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    // ██║     ██╔═══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    // ██║     ██║   ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
    // ██║     ██║   ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    // ███████╗╚██████╔╝╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    // ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

    // 'get /users/location': "LocationController.getUsersByLocation",
    // 'post /me/location': "LocationController.setUserLocation",

    // ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ ███████╗
    // ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗██╔════╝
    //    ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝███████╗
    //    ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗╚════██║
    //    ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║███████║
    //    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝

    // 'post /track/site_visit': "TrackersController.site_visit",

};

// Routes that don't need versionning (does not start with '/api/v*/' )
var _VIEW_ROUTES = {
    'get /users/validate/:registrationToken': "UserController.validateEmail",
    // SSL CERTIFICATE
    // 'get /.well-known/acme-challenge/:key': "TestController.ssl",
};

var ROUTE_PREFIX = "/api/v1";

// add global prefix to manually defined routes
var addGlobalPrefix = function(apiRoutes) {
    var newRoutes = {};

    var paths = Object.keys(apiRoutes);
    paths.forEach(function(path) {
        var pathParts = path.split(" "),
            uri = pathParts.pop(),
            prefixedURI = "",
            newPath = "";

        prefixedURI = ROUTE_PREFIX + uri;

        pathParts.push(prefixedURI);

        newPath = pathParts.join(" ");
        // construct the new routes
        newRoutes[newPath] = apiRoutes[path];
    });

    for (var route in _VIEW_ROUTES) {
        newRoutes[route] = _VIEW_ROUTES[route];
    }

    return newRoutes;
};

module.exports.routes = addGlobalPrefix(_ROUTES);