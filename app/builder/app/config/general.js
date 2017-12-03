
//  █████╗ ██████╗ ██████╗        ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
// ██╔══██╗██╔══██╗██╔══██╗      ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
// ███████║██████╔╝██████╔╝      ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║ ████╗
// ██╔══██║██╔═══╝ ██╔═══╝       ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ██║  ██║██║     ██║           ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
// ╚═╝  ╚═╝╚═╝     ╚═╝            ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ 

var config = {
    provide: function(name, fn) {
        this[name] = safelyProvide(fn);
    },
    app: {
        provide: function(name, fn) {
            this[name] = safelyProvide(fn);
        }
    }
};

config.app.provide("name", "app");
config.app.provide("parent_states", ["root", "main"]);
config.app.provide("script_to_remove", ["code.min.js", "lib.min.js"]);
config.app.provide("delay_transition", 0);
config.app.provide("default_bubble_color", 'model.default');
config.app.provide("default_anim_return", "move-right");
config.app.provide("default_visitor_name", "Visitor");
config.app.provide("dom", {
    //must be the same time than in the scss
    anim_time: 300,
    delay_transition: 0,
    default_anim_leaving: "fade",
    global_wrapper: "body, html"
});

/**************************************************************************\
*                                                                          *
* BACKEND API URL                                                          *
* this is the main api url. it will be used by default                     *
* You can add as many api urls as you want. you just need to respect the   *
* naming convention : "{anyApiName}Url"                                    *
* to use them, add a serv key with the {anyApiName} in the route config    *
* file. Here"s an example :                                                *
*                                                                          *
*   googleTimezone: {                                                      *
*       method: "GET",                                                     *
*       serv: "googleMapsApi",                                             *
*       url: "timezone/json"                                               *
*   }                                                                      *
*                                                                          *
\**************************************************************************/

config.app.provide("apiProdUrl", "https://hey-hey.co/api/v1/");
config.app.provide("apiUrl", "http://localhost:1337/api/v1/");

/**************************************************************************\
*                                                                          *
* EXTENSION ID                                                             *
*                                                                          *
\**************************************************************************/
config.app.provide("extension_id", "oljapmkoghjdmahglcpflcgcejpdecap");

/**************************************************************************\
*                                                                          *
* FACEBOOK CONFIG                                                          *
*                                                                          *
\**************************************************************************/
// facebook constants: auth redirect url && app ID
config.app.provide('facebook', {
    redirect_uri_dev: 'http://localhost:1337/api/v1/login/facebook',
    redirect_uri: 'https://hey-hey.co/api/v1/login/facebook',
    client_id: '198509383970250',
    response_type: 'code',
    // see all scope permissions :
    // https://developers.facebook.com/docs/facebook-login/permissions/
    scope: ['public_profile', 'email']
});

/**************************************************************************\
*                                                                          *
* GOOGLE CONFIG                                                            *
*                                                                          *
\**************************************************************************/
// google constants: auth redirect url && app ID
// docs : https://developers.google.com/identity/protocols/OAuth2WebServer
config.app.provide('google', {
    redirect_uri_dev: 'http://localhost:1337/api/v1/login/google',
    redirect_uri: 'https://hey-hey.co/api/v1/login/google',
    client_id: '67811228606-h2g6fsosmtnq1cf8627r497ir18dbb8b.apps.googleusercontent.com',
    response_type: 'code',
    // see all scope permissions :
    // https://developers.google.com/identity/protocols/googlescopes
    scope: ['profile', 'email'],
    access_type: 'online',
    include_granted_scopes: 'true'
});

/**************************************************************************\
*                                                                          *
* APP PREFIX                                                               *
* prefix before some var names such as localstorage variables for instance *
*                                                                          *
\**************************************************************************/
config.app.provide("app_prefix", "hey_");

/**************************************************************************\
*                                                                          *
* SILENT ERROR                                                             *
*                                                                          *
\**************************************************************************/
config.app.provide("silent_error", true);

/**************************************************************************\
*                                                                          *
* HELLO WIDGET                                                             *
*                                                                          *
\**************************************************************************/
config.app.provide("hello_widget", {
    delay: 1000 * 3600 * 24, // one day
    max_times: 3 // show it maximum 3 times
});

/**************************************************************************\
*                                                                          *
* IFRAME REQUEST LIST                                                      *
*                                                                          *
\**************************************************************************/
config.app.provide("ifrm_request_list", [
    "location",
    "appReady",
    "dataLoaded",
    "facebookConnect",
    "googleConnect",
    "facebookAuth",
    "closeIframe",
    "switchSide",
    "heartbeat",
    "refresh",
    "action:question",
    "action:danger",
    "action:comment",
    "action:void",
    "action:hey",
    "action:notification.on",
    "action:notification.off",
    "print_cookie",
    "ifrm.open",
    "ifrm.close",
    "href",
    "hideTooltip"
]);

/**************************************************************************\
*                                                                          *
* EMOJIS                                                                   *
* https://apps.timwhitlock.info/emoji/tables/unicode#note5                 *
*                                                                          *
\**************************************************************************/
config.app.provide("emoji", [
    "1F603",
    "1F609",
    "1F60E",
    "1F606",
    "1F605",
    "1F60A",
    "1F61B",
    "1F614",
    "1F621",
    "1F632",
    "1F631",
    "1F62D",
    "1F44D",
    "1F636"
]);

/**************************************************************************\
*                                                                          *
* EMOJIS                                                                   *
* https://apps.timwhitlock.info/emoji/tables/unicode#note5                 *
*                                                                          *
\**************************************************************************/
config.app.provide("no_header_states", [
    "root.landing",
]);

/**************************************************************************\
*                                                                          *
* ENTRY REQUEST                                                            *
*                                                                          *
\**************************************************************************/
config.app.provide("entry", {
    limit: 20,
    types: ['comment', 'question', 'report']
});

/**************************************************************************\
*                                                                          *
* TMP ENVIRONMENTS                                                         *
*                                                                          *
\**************************************************************************/
config.app.provide("ifrm_env", {
    default: 'inklabs',
    inklabs: {
        hash: "#/",
        host: "inklabs.be",
        hostname: "inklabs.be",
        href: "http://inklabs.be",
        origin: "http://inklabs.be",
        pathname: "/",
        port: "",
        protocol: "http:",
        search: ""
    },
    hey: {
        hash: "",
        host: "hey-hey.co",
        hostname: "hey-hey.co",
        href: "https://hey-hey.co",
        origin: "https://hey-hey.co",
        pathname: "/",
        port: "",
        protocol: "https:",
        search: ""
    },
    fondation_audrey_jacobs: {
        hash: "",
        host: "fondationaudreyjacobs.inklabs.be",
        hostname: "fondationaudreyjacobs.inklabs.be",
        href: "http://fondationaudreyjacobs.inklabs.be",
        origin: "http://fondationaudreyjacobs.inklabs.be",
        pathname: "/",
        port: "",
        protocol: "http:",
        search: ""
    },
    cercle_dynamique: {
        hash: "",
        host: "www.cercledynamique.be",
        hostname: "www.cercledynamique.be",
        href: "http://www.cercledynamique.be",
        origin: "http://www.cercledynamique.be",
        pathname: "/",
        port: "",
        protocol: "http:",
        search: ""
    },
    get: function() {
        return config.app.ifrm_env[config.app.ifrm_env.default];
    }
});

/**************************************************************************\
*                                                                          *
* REGEX                                                                    *
* list of REGEX expressions                                                *
*                                                                          *
\**************************************************************************/
config.app.provide("regex", {
    alphaNumPattern: /^[a-z0-9]*$/,
    hexPattern: /^#[a-zA-Z0-9]{3}([a-zA-Z0-9]{3})?$/,
    emailPattern: /^[a-z]+[a-z0-9._]+@[a-z0-9_-]+\.[a-z.]{2,5}$/,
    domainPattern: /^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{1,61}$/,
    href_sanitizer: /^\s*(https?|ftp|mailto|chrome-extension|safari-extension):/,
    src_sanitizer: /^\s*(https?|ftp|mailto|chrome-extension|safari-extension):/
});

/**************************************************************************\
*                                                                          *
* LOCALSTORAGE KEYS                                                        *
* enter all the keys for localstorage here                                 *
*                                                                          *
\**************************************************************************/
config.app.provide("localstorage_keys", {
    "USER": "u",
    "isAuthentified": "auth"
});

/**************************************************************************\
*                                                                          *
* ADAPTATIVE APP                                                           *
* change global app settings here to enable/disable features               *
*                                                                          *
\**************************************************************************/
config.app.provide("features", {
    "post_types": false
});

/**************************************************************************\
*                                                                          *
* DEFAULT USER PICTURE                                                     *
*                                                                          *
\**************************************************************************/
config.app.provide("default_user_picture", "assets/profile-default_360.png");

/**************************************************************************\
*                                                                          *
* APP AUTO LOADING                                                         *
* variables that is used in nbInterceptor                                  *
*   [] => nothing                                                          *
*   "all" => everything                                                    *
*   ["POST",...] => list specific http types                               *
*                                                                          *
\**************************************************************************/
config.app.provide("interceptor", {
    autoLoadingFor: ["POST", "PATCH", "PUT", "PATCH"],
    autoAddLanguage: true,
    log: false
});

/**************************************************************************\
*                                                                          *
* APP DEPENDENCIES                                                         *
* add here all the dependencies installed via grunt                        *
*                                                                          *
\**************************************************************************/
config.app.provide("deps", [
    "ui.router",
    "ngAnimate",
    "ngFileUpload",
    "ngResource",
    "angular-cache",
    "ui.ace", // ace : awesome snippet tool
    "ngDragDrop",
    "yaru22.angular-timeago", // display date as time ago (2 days ago)
]);

/**************************************************************************\
*                                                                          *
* APP GLOBALS                                                              *
*                                                                          *
\**************************************************************************/

// this variable can be modified while building build.sh
config.app.provide("production", false);
config.app.provide("environment", "admin");

config.app.provide("home_state", (config.app.environment === 'web') ? 'root.landing' : 'root.home');