//  █████╗ ███╗   ██╗ ██████╗ ██╗   ██╗██╗      █████╗ ██████╗       ██╗███╗   ██╗██╗████████╗
// ██╔══██╗████╗  ██║██╔════╝ ██║   ██║██║     ██╔══██╗██╔══██╗      ██║████╗  ██║██║╚══██╔══╝
// ███████║██╔██╗ ██║██║ ████╗██║   ██║██║     ███████║██████╔╝      ██║██╔██╗ ██║██║   ██║   
// ██╔══██║██║╚██╗██║██║   ██║██║   ██║██║     ██╔══██║██╔══██╗      ██║██║╚██╗██║██║   ██║   
// ██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝███████╗██║  ██║██║  ██║      ██║██║ ╚████║██║   ██║   
// ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝      ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   

var app = angular.module(config.app.name, config.app.deps.concat(config.app.widgets).concat(config.app.components));
app.constant('config', config);

app.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'config', 'CacheFactoryProvider', '$sceDelegateProvider', '$compileProvider',
    function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, config, CacheFactoryProvider, $sceDelegateProvider, $compileProvider) {

        // SANITIZE URLS
        $compileProvider.aHrefSanitizationWhitelist(config.app.regex.href_sanitizer);
        $compileProvider.imgSrcSanitizationWhitelist(config.app.regex.src_sanitizer);

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;

        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // TODO: uncomment when prod
        $compileProvider.debugInfoEnabled(false);

        // RELEASE
        // $locationProvider.html5Mode(true).hashPrefix('!');

        // SERVER
        $locationProvider.hashPrefix('!');

        // INIT PAGE
        $urlRouterProvider.otherwise('/');

        // CACHEFACTORYPROVIDER
        angular.extend(CacheFactoryProvider.defaults, {
            maxAge: 15 * 60 * 1000,
            deleteOnExpire: 'aggressive',
            storageMode: 'localStorage'
        });

        //authorize main server
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://**',
            'https://**'
        ]);

        //define the states
        (function states_setup() {

            set_states = function(states, parentToChildren) {

                var state, name, names, file_name, ctrl_name, state_config, origin, view_config, html_folder, template_url;

                for (var index in states) {
                    //retrieve state
                    state = states[index];
                    //state name
                    name = state.id;
                    //construct controller name
                    names = state.id.split('.');
                    file_name = state.file_name ||  names[names.length - 1];
                    ctrl_name = state.ctrl_name || file_name.charAt(0).toUpperCase() + file_name.slice(1);
                    //get origin
                    state_config = {};

                    //1. copy everything
                    for (var key in state) {
                        state_config[key] = state[key];
                    }
                    //2. custom parametrisation
                    //A - ORIGIN
                    origin = "main";
                    if (state.origin) {
                        origin = state.origin;
                    } else if (names.length > 1) {
                        origin = names[names.length - 2];
                    }
                    state_config.origin = origin;

                    //B - to save current tab
                    if (!state.tab) {
                        state_config.tab = file_name;
                    }
                    //C - abstract state => no instantiation 
                    if (state.abstract) {
                        state_config.abstract = true;
                        if (state.no_html) {
                            state_config.template = '<div ui-view="' + origin + '"><div/>';
                        }
                    }
                    //D - handle html connexion
                    if (!state.no_html) {
                        view_config = {};
                        //get html folder
                        html_folder = config.app.html_folder || "html/";
                        template_url = html_folder + file_name + ".html";

                        state.template_url = template_url;

                        view_config.templateUrl = template_url;

                        if (!state.no_controller)
                            view_config.controller = ctrl_name + "Controller as " + file_name;
                        state_config.views = {};
                        state_config.views[origin] = view_config;
                    }
                    //E - policy
                    if (state.policy !== undefined) {
                        state_config.policy = (typeof state.policy === 'string') ? [state.policy] : state.policy;
                    } else {
                        state_config.policy = [];
                    }

                    if (parentToChildren && parentToChildren.policy !== undefined) {
                        if (typeof parentToChildren.policy === 'string') {
                            state_config.policy.push(parentToChildren.policy);
                        } else {
                            state_config.policy = state_config.policy.concat(parentToChildren.policy);
                        }
                    }

                    if (state.states && state.states[0] && state.states[0].id) {
                        if (state_config.policy.length > 0) {
                            set_states(state.states, {
                                policy: state_config.policy
                            });
                        } else {
                            set_states(state.states);
                        }

                    }

                    //3. register state
                    $stateProvider.state(state.id, state_config);
                }
            };
            set_states(config.app.states);
        })();
    }
]);

//Global features of the APP
app.run(['$q', '$state', '$rootScope', '$http', "$timeout", '$templateCache', 'sharedData', 'atmosphere', 'userSession', '$window', 'Page', 'User', 'UX', 'CommonApi', 'Tracker',
    function($q, $state, $rootScope, $http, $timeout, $templateCache, sharedData, atmosphere, userSession, $window, Page, User, UX, CommonApi, Tracker) {

    // EXTENSION URL
    $rootScope.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    // TMP
    $rootScope.provide('openModal', function(){
        console.log('MODAL :: ', arguments);
    });

    $rootScope.provide('chrome_ext_id', function(isUrl, url) {
        if (isUrl) {
            return "chrome-extension://" + config.app.extension_id + "/xt_content/" + url;
        } else {
            return config.app.extension_id;
        }
    });

    // GET FAVICON
    $rootScope.provide('favicon', helper.getFavicon);

    // USERNAME
    $rootScope.provide('setUsername', function(_f, _l, _u) {
        if (_f && _f.first_name) {
            if (_f.username) {
                return _f.username;
            } else {
                return _f.first_name + ' ' + _f.last_name;
            }

        } else {
            if (_u) {
                return _u;
            } else if (_f && _l) {
                return _f + ' ' + _l;
            } else {
                return config.app.default_visitor_name;
            }
        }
    });

    // GET SITE TITLE
    $rootScope.provide('siteTitle', helper.getSiteTitle);

    // ACE
    $rootScope.provide('ACE', {
        ace_content: '',
        aceLoaded: function(_editor) {
            // console.log('ace loaded');
            // Options
            // _editor.setReadOnly(true);
            // var _session = _editor.getSession();

            // _session.setMode("ace/mode/javascript");

            _editor.$blockScrolling = Infinity;
        },
        aceChanged: function(e) {
            // console.log('ace changed');
            //
        },
        getSnippet: function() {

            $rootScope.openModal('codeSnippet', {}, function(data) {
                // saved
                console.log('saved..', $rootScope.ACE.ace_content);
                $rootScope.FOOTER.content.code_snippet = $rootScope.ACE.ace_content;

            }, function(data) {
                // canceled
                console.log('canceled..', data);
                $rootScope.FOOTER.content.code_snippet = '';

            });

        }

    });

    // DEFERRED INIT AVOIDING FLICKERING EFFECT
    $rootScope.provide('deferredInit', function(func, loading) {
        var deferred = $q.defer();
        // if (loading) {
        //     $rootScope.loading();
        // }
        $timeout(function() {
            // if (loading) {
            //     $rootScope.loaded();
            // }
            if (typeof func == 'function') {
                func()
            }
            deferred.resolve()
        }, config.app.dom.anim_time || 500);

        return deferred.promise;
    });

    // NAVIGATION / GO
    $rootScope.provide('changeState', function(state_id, anim, params, $event) {
        if ($event) {
            console.log('$event', $event);
        }
        if ($rootScope.transition_blocked) {
            return false;
        }
        if (anim === 'move-left' || anim === 'move-right' && config.app.environment === 'web') {
            anim = 'fade';
        }

        $rootScope.setAnim(anim).then(function() {

            if (state_id === '__home') {
                state_id = config.app.home_state;
            }

            $state.go(state_id, params ? params : null);

        });
    });

    // NAVIGATION / GO
    $rootScope.provide('changeSite', function(url) {
        atmosphere.get('href', url);
    });

    // NAVIGATION / GO BACK
    $rootScope.provide('goBack', function(custom_anim, num) {
        custom_anim = custom_anim ? custom_anim : (config.app.default_anim_return ? config.app.default_anim_return : 'fade');
        num = num ? num : 1;
        if ($rootScope.transition_blocked)
            return false;
        $rootScope.setAnim(custom_anim).then(function() {
            $rootScope.previousStates.splice(0, num);
            if (!$rootScope.previousStates[0]) {
                $rootScope.previousStates[0] = config.app.home_state;
            }
            // $window.history.go(-num);
            $rootScope.changeState($rootScope.previousStates[0], custom_anim);
        });
    });

    // NAVIGATION / SET ANIMATION
    $rootScope.provide('setAnim', function(anim) {
        var anim_return = anim ? anim : (config.app.anim_return ? config.app.anim_return : 'move-right');

        var deferred = $q.defer();
        var time = 0;

        if ($rootScope['appAnimation'] != anim_return) {
            $rootScope['appAnimation'] = anim_return;
            time = config.app.dom.delay_transition;
        }
        $timeout(function() {
            deferred.resolve();
        }, time);
        return deferred.promise;
    });

    // USER PICTURE
    $rootScope.provide('getUserPicture', function(_user, _clear_cache) {

        var _protocol = ($rootScope.GLOBAL && $rootScope.GLOBAL.location && $rootScope.GLOBAL.location.protocol === 'http') || ($rootScope.GLOBAL && $rootScope.GLOBAL.location && $rootScope.GLOBAL.location.protocol === 'https') ? $rootScope.GLOBAL.location.protocol : 'http';

        if (_user === 'self') {
            _user = $rootScope.USER.nfo();
        }

        if (_user && _user.picture && !_clear_cache) {
            // user picture or cached version
            return _user.picture;
        } else if (_user && _user.facebook_id && _user.id) {
            // facebook
            return _protocol + '://graph.facebook.com/v2.8/' + _user.facebook_id + '/picture?type=square&width=360';
        } else if (_user && _user.google_id && _user.id && false) {
            // google (temp disabled.. does not work)
            return _protocol + '://www.googleapis.com/plus/v1/people/' + _user.google_id + '?fields=image&key=' + config.app.google.client_id;
        } else if (_user && _user.picture) {
            return _user.picture;
        } else {
            return config.app.default_user_picture;
        }

    });

    // GLOBAL
    $rootScope.provide('GLOBAL', {
        // CONFIG
        status: null,
        production: config.app.production,
        environment: config.app.environment,
        allow_read_entries: config.app.allow_read_entries,
        allow_create_entries: false,
        allow_question_answer: false,
        page: null,
        site: null,
        location: null,
        // PAGE DATA
        page_data: null,
        // SITE DATA
        site_data: null,
        // SITE INFO
        site_info: null,
        // PAGE SEARCH
        page_search_header: true,
        page_search_data: null,
        page_search_mode: false,
        page_search_input: '',
        page_search_loading: false,
        page_search_loaded: false,
        // CONFIG
        features: config.app.features,
        facebookWatcher: false,
        googleWatcher: false,
        entry_request: {
            limit: config.app.entry.limit,
            offset_index: 0,
            loaded: false
        }
    });

    // FOOTER
    // $rootScope.provide('FOOTER', {
    //     visible: false,
    //     active: false,
    //     emoji: false,
    //     emoji_char_list: config.app.emoji,
    //     emoji_char: null,
    //     emoji_char_lines: 2,
    //     once_unfocus: false,
    //     data: null,
    //     animation: 300,
    //     type: 'comment',
    //     content: {
    //         text: '',
    //         code_snippet: ''
    //     },
    //     open: function(type, cb) {
    //         $rootScope.FOOTER.type = type ? type : 'comment';
    //         $timeout(function() {
    //             $rootScope.FOOTER.visible = true;
    //             if (typeof cb === 'function') {
    //                 cb();
    //             }
    //         }, $rootScope.FOOTER.animation);
    //     },
    //     changeState: function(state_id, anim) {
    //         $rootScope.FOOTER.visible = false;
    //         $timeout(function() {
    //             $rootScope.FOOTER.type = '';
    //             $rootScope.changeState(state_id, anim);
    //         }, $rootScope.FOOTER.animation);
    //     },
    //     setType: function(type) {
    //         $rootScope.FOOTER.type = type;
    //         $rootScope.FOOTER.focus(true);
    //     },
    //     close: function(callback) {
    //         $rootScope.FOOTER.data = null;
    //         $rootScope.FOOTER.type = 'comment';
    //         $rootScope.FOOTER.active = false;
    //         $rootScope.FOOTER.visible = false;
    //         $rootScope.FOOTER.emoji = false;
    //         $timeout(function() {
    //             $rootScope.FOOTER.type = 'comment';
    //             if (typeof callback === 'function') {
    //                 callback();
    //             }
    //         }, $rootScope.FOOTER.animation);
    //     },
    //     focus: function(_open) {
    //         if (!$rootScope.FOOTER.visible && _open) {
    //             $rootScope.FOOTER.visible = true;
    //         }
    //         if ($rootScope.FOOTER.once_unfocus) {
    //             $rootScope.FOOTER.once_unfocus = false;
    //         } else {
    //             $rootScope.FOOTER.active = true;
    //             UX.focus('#footer-input');
    //         }
    //     },
    //     blur: function(cb) {
    //         $rootScope.FOOTER.data = null;
    //         $rootScope.FOOTER.type = 'comment';
    //         $rootScope.FOOTER.active = false;
    //         $rootScope.FOOTER.emoji = false;
    //         if (typeof cb === 'function') {
    //             $timeout(cb, $rootScope.FOOTER.animation);
    //         }
    //     },
    //     switchEmoji: function() {
    //         $rootScope.FOOTER.emoji = !$rootScope.FOOTER.emoji;
    //         if (!$rootScope.FOOTER.emoji) {
    //             UX.focus('#footer-input');
    //         }
    //     },
    //     update: function() {
    //         if (!$rootScope.FOOTER.active) {
    //             $rootScope.FOOTER.active = true;
    //         }
    //     },
    //     reply: function(_ENTRY) {
    //         $rootScope.FOOTER.data = _ENTRY;
    //         $rootScope.FOOTER.setType('reply');
    //     },
    //     initEmoji: function() {
    //         var tmp_emoji_line = [],
    //             tmp_emoji = [],
    //             index = 0;
    //         for (var l = 0; l < $rootScope.FOOTER.emoji_char_lines; l++) {
    //             tmp_emoji_line = [];
    //             for (var e = 0; e < Math.ceil($rootScope.FOOTER.emoji_char_list.length / $rootScope.FOOTER.emoji_char_lines); e++) {
    //                 if (index < $rootScope.FOOTER.emoji_char_list.length) {
    //                     tmp_emoji_line.push(twemoji.convert.fromCodePoint($rootScope.FOOTER.emoji_char_list[index]));
    //                     index++;
    //                 } else {
    //                     break;
    //                 }
    //             }
    //             tmp_emoji.push(tmp_emoji_line);
    //         }
    //         $rootScope.FOOTER.emoji_char = tmp_emoji;
    //     }
    // });

    // NOTIFICATIONS
    $rootScope.provide('USER_NOTIFICATIONS', {
        notifications: [],
        unreads: false,
        visible: false,
        animation: 300,
        readOnClose: true,
        open: function(cb) {
            $timeout(function() {
                $rootScope.USER_NOTIFICATIONS.visible = true;
                if (typeof cb === 'function') {
                    cb();
                }
            }, $rootScope.USER_NOTIFICATIONS.animation);
        },
        close: function(cb) {
            $rootScope.USER_NOTIFICATIONS.visible = false;
            if ((cb === 'readNotifications' || $rootScope.USER_NOTIFICATIONS.readOnClose) && $rootScope.USER_NOTIFICATIONS.unreads) {
                for (var n in $rootScope.USER_NOTIFICATIONS.notifications) {
                    $rootScope.USER_NOTIFICATIONS.notifications[n].read = true;
                }
                $rootScope.USER_NOTIFICATIONS.unreads = false;
                User.checkAndUpdateLastNotificationReads();
            }
            $timeout(function() {
                if (typeof cb === 'function') {
                    cb();
                }
            }, $rootScope.USER_NOTIFICATIONS.animation);
        },
        switch: function(cb) {
            $rootScope.USER_NOTIFICATIONS[$rootScope.USER_NOTIFICATIONS.visible ? 'close' : 'open'](cb);
        }
    });

    // CONSTRUCTOR
    $rootScope.provide('init', function() {

        if (config.app.environment === 'web') {
            // WATCH SCREEN HIDE/SHOW
            helper.watchScreen(function(screen_visible) {

                if (screen_visible) {
                    // CHECK FACEBOOK/GOOGLE WATCHER
                    CommonApi.social.callback();
                }

            });
        }

        // VARIABLES
        $rootScope.REGEX = config.app.regex;
        $rootScope.USER = userSession;
        $rootScope.previousStates = [];
        $rootScope.provide('dataCache', {
            comment: {},
            question: {},
            report: {}
        });
        $rootScope.HEADER_TYPE = 'home';
        // $rootScope.FOOTER.initEmoji();
        // ACE CONFIG
        ace.config.set('basePath', 'ace-lib/');
        ace.config.set('modePath', 'ace-lib/');
        ace.config.set('themePath', 'ace-lib/');
        ace.config.set('workerPath', 'ace-lib/');

        $rootScope.provide('ace_config', {
            useWrapMode: false,
            showGutter: true,
            theme: 'inklabs',
            mode: 'javascript',
            firstLineNumber: 1,
            onLoad: $rootScope.ACE.aceLoaded,
            onChange: $rootScope.ACE.aceChanged,
            require: ['ace/ext/language_tools'],
            advanced: {
                enableSnippets: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            }
        });

        // LANGUAGE
        if ($rootScope.GLOBAL.language) {
            // console.log("we detected a language : ", $rootScope.GLOBAL.language);
            $rootScope.changeLanguage($rootScope.GLOBAL.language);
        } else {
            // console.log("ok we have to set it");
            //Language handling
            if (navigator.globalization) {
                // console.log("navigator globalization");
                navigator.globalization.getPreferredLanguage(function(language) {
                    var localLanguage = language.value.substring(0, 2).toLowerCase();
                    var found = false;

                    // console.log('browser language', language, 'so : ', localLanguage);

                    var languages = $rootScope.availableLanguages();
                    // console.log("availableLanguages : ", languages);
                    for (var i in languages) {
                        var lg = languages[i];
                        if (lg.value == localLanguage) {
                            found = true;
                            $rootScope.changeLanguage(lg.value);
                            break;
                        }
                    }
                    if (!found) {
                        // console.log("not in availableLanguages");
                        $rootScope.changeLanguage($rootScope.getData("appLanguage") || 'en');
                    }
                    $rootScope.GLOBAL.language = $rootScope.getLanguage();
                    $rootScope.saveData("GLOBAL", $rootScope.GLOBAL);
                    $rootScope.saveData("GLOBAL", $rootScope.GLOBAL);
                });
            } else {
                // console.log("no navigator globalization, GLOBAL : ", $rootScope.GLOBAL);
                $rootScope.changeLanguage('en');
                $rootScope.GLOBAL.language = $rootScope.getLanguage();
                $rootScope.saveData("GLOBAL", $rootScope.GLOBAL);
            }

        }

        userSession.connected(function(connected) {

            $rootScope.SHOW_TOOLTIP = ($rootScope.getData('hey-tooltip-last-open') && ((new Date()).getTime() - $rootScope.getData('hey-tooltip-last-open') < config.app.hello_widget.delay)) ? false : (parseInt($rootScope.getData('hey-tooltip-opens') ? $rootScope.getData('hey-tooltip-opens') : 0) <= config.app.hello_widget.max_times);
            $rootScope.SHOW_TOOLTIP = $rootScope.SHOW_TOOLTIP && $rootScope.USER.isAuthentified();

            // atmosphere.get('appReady', {
            //     production: config.app.production,
            //     connected: connected,
            //     showTooltip: $rootScope.SHOW_TOOLTIP,
            //     tooltip_message: 'Yeaaaah'
            // });

            var pickupMessage = function(_messages) {
                console.log('LOCATION ————', $rootScope.GLOBAL.location);

                var found = false;
                var message = null;
                // PAGES
                if (_messages && _messages.pages && $rootScope.GLOBAL && $rootScope.GLOBAL.location && $rootScope.GLOBAL.location.href) {
                    for (var e in _messages.pages) {
                        if (_messages.pages[e].pages.indexOf($rootScope.GLOBAL.location.href) > -1) {
                            found = true;
                            message = _messages.pages[e].message;
                            break;
                        }
                    }
                }
                // STARTING
                if (!found && _messages && _messages.starting && $rootScope.GLOBAL && $rootScope.GLOBAL.location && $rootScope.GLOBAL.location.href) {
                    for (var e in _messages.starting) {
                        if ($rootScope.GLOBAL.location.href.indexOf(_messages.starting[e].key) === 0) {
                            found = true;
                            message = _messages.starting[e].message;
                            break;
                        }
                    }
                }
                // CONTAINS
                if (!found && _messages && _messages.contains && $rootScope.GLOBAL && $rootScope.GLOBAL.location && $rootScope.GLOBAL.location.href) {
                    for (var e in _messages.contains) {
                        if ($rootScope.GLOBAL.location.href.indexOf(_messages.contains[e].key) > -1) {
                            found = true;
                            message = _messages.contains[e].message;
                            break;
                        }
                    }
                }
                // DEFAULT
                if (!found && _messages) {
                    if (_messages.default) {
                        message = _messages.default;
                    }
                }

                return message;
            };

            var appReadyCb = function(data) {

                // atmosphere
                atmosphere.get('dataLoaded', {
                    production: config.app.production,
                    connected: connected,
                    showTooltip: data.showTooltip,
                    tooltip_message: pickupMessage(data.messages),
                    color: data && data.color ? data.color : config.app.default_bubble_color
                });

                // trackers
                Tracker.post('site_visit', {
                    smart_message_on: data.showTooltip ? true : false,
                    // increment and count on localstorage
                    num_visits: 1
                });

            };

            // BACKEND CONNECTION - we need to determine what comes first, force authentication or allow consult without account..
            // for now, we'll force, as users need to setup the extension first. we should track this.
            // if (connected || config.app.allow_read_entries) {
            //     //INIT
            //     Page.get().then(function(_data) {
            //         $rootScope.app_loaded = true;
            //         Page.getSiteInfo().then(function(data) {
            //             console.log('*site data :', data);
            //             var __icon = (data && data.result && data.result.color) ? data.result.color : config.app.default_bubble_color;
            //             if (data && data.result) {
            //                 $rootScope.GLOBAL.site_info = data.result;
            //                 $rootScope.GLOBAL.code_snippet_active = data.result.code_snippet;
            //             }
            //             appReadyCb({
            //                 color: __icon,
            //                 messages: data.result.messages,
            //                 showTooltip: data.result.bubble
            //             });
            //         });
            //     });
            // } else {
            //     if (window.location.hostname == 'localhost') {
            //         // adding local dev version, in case we are working on localhost and thus there is no extension.
            //         // working with sample location (inklabs.be)
            //         $rootScope.GLOBAL.location = config.app.ifrm_env.get();
            //         $rootScope.app_loaded = true;

            //     } else {
            //         atmosphere.get('location', function(response) {
            //             $rootScope.GLOBAL.location = response.location;
            //             $rootScope.app_loaded = true;
            //         });

            //     }
            //     appReadyCb();
            // }

            $rootScope.app_loaded = true;
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            //handle language
            if (toParams.language) {
                if ($rootScope.getLanguage() != toParams.language)
                    $rootScope.changeLanguage(toParams.language);
            }

            //handle private state
            if (toState.private) {
                event.preventDefault();
                $state.go('root.auth', { referer: toState.name });
            }

            // header display
            // $rootScope.GLOBAL.no_header = helper.inArray(toState.name, config.app.no_header_states);

            // policies
            if (toState.policy) {
                if (helper.inArray('authentified', toState.policy) && !$rootScope.USER.isAuthentified()) {
                    event.preventDefault();
                    $rootScope.changeState("root.auth", "move-right");

                } else if (helper.inArray('authentified:allow_read', toState.policy) && !$rootScope.USER.isAuthentified() && !config.app.allow_read_entries) {
                    event.preventDefault();
                    $rootScope.changeState("root.auth", "move-right");

                } else if (helper.inArray('not_authentified', toState.policy) && $rootScope.USER.isAuthentified()) {
                    event.preventDefault();
                    $rootScope.changeState("root.home", "move-left");

                }
            }

        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // SCROLL TOP FUNCTION
            $timeout(function() {
                $(config.app.dom.global_wrapper).animate({
                    scrollTop: 0
                }, config.app.dom.anim_time);
            });
            $rootScope.previousStates.unshift(toState.name);
            $rootScope.currentState = toState.name;
            $rootScope.currentStatePolicy = toState.policy;
        });

        // PRELOAD TEMPLATE
        for (var key in config.app.states) {
            var state = config.app.states[key];
            if (state.template_url) {
                $http.get(state.template_url, { cache: $templateCache });
            }
        }
    })

    $rootScope.init();

}]);