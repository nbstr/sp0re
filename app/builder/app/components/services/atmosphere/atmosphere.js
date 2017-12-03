var atmosphere = angular.module("atmosphereModule", []);

atmosphere.service("atmosphere", ['$rootScope', '$timeout', 'UX', '$window', 'Tracker', function($rootScope, $timeout, UX, $window, Tracker) {

    //atmosphere Service

    var self = this,
        found = false;
    self.global_watchers_init = false;
    self.stack = [];
    self.request_list = config.app.ifrm_request_list;
    self.global_watchers = [{
        key: 'heartbeat',
        action: function(data) {
            // console.log('hearbeat, now check auth');
            $rootScope.USER.connected(function(is_connected) {
                if (is_connected) {
                    if ($rootScope.inlineAuthModal) {
                        $rootScope.closeModal('inlineAuth');
                    }
                    if (helper.inArray('not_authentified', $rootScope.currentStatePolicy)) {
                        $rootScope.changeState(config.app.home_state, "move-left");
                    }
                } else {
                    // don't know about that..
                    // $rootScope.FOOTER.close();

                    // check first if read is allowed and we are on an authorized state
                    if (helper.inArray('authentified:allow_read', $rootScope.currentStatePolicy) && !config.app.allow_read_entries) {
                        $rootScope.changeState("root.auth", "move-right");
                    }
                    // check then if authentified
                    else if (helper.inArray('authentified', $rootScope.currentStatePolicy)) {
                        $rootScope.changeState("root.auth", "move-right");
                    }
                }
            });
        }
    }, {
        key: 'refresh',
        action: function(data) {
            // console.log('data : ', data);
            $rootScope.PageResource.get(data.location);
        }
    }, {
        key: 'ifrm.close',
        action: function() {
            // console.log('closing iframe');
            $timeout(function() {
                $rootScope.FOOTER.blur();
            }, 500);

        }
    }, {
        key: 'ifrm.open',
        action: function(data) {
            // focus on footer if it is open
            if ($rootScope.FOOTER.visible) {
                $timeout(function() {
                    $rootScope.FOOTER.once_unfocus = true;
                    UX.focus('#footer-input');
                }, 500);
            }
            // trackers
            Tracker.post('site_visit', {
                num_bubble_opens: 1
            });
        }
    }, {
        key: 'ifrm.go',
        action: function(data) {
            if (data.hey.indexOf('ncr.a.') > -1) {
                var answer_id = (data.hey.substr(data.hey.indexOf('ncr.a.') + 6));
                console.log('ID', answer_id)
                $rootScope.changeState('root.entryDetail', 'fade', { 'id': answer_id, 'type': 'answer', 'ncr': answer_id });
            }
        }
    }, {
        key: 'hideTooltip',
        action: function() {

            // check if remove notification bubble
            $rootScope.SHOW_TOOLTIP = false;

            if (!$rootScope.USER_NOTIFICATIONS.unreads) {
                self.get('action:notification.off');
            }

            // store times and delay
            $rootScope.saveData('hey-tooltip-last-open', (new Date()).getTime());
            $rootScope.saveData('hey-tooltip-opens', parseInt($rootScope.getData('hey-tooltip-opens') ? $rootScope.getData('hey-tooltip-opens') : 0) + 1);
        }
    }];

    self.post = function(_req, _data) {

        if (self.request_list.indexOf(_req) > -1) {
            if (config.app.environment === 'web') {
                if (_req === 'location') {
                    self.onMessage({
                        data: {
                            success: true,
                            req: 'location',
                            location: helper.getLocation()

                        }
                    });
                }
            } else {
                $window.top.postMessage({
                    req: _req,
                    data: _data ? _data : {}
                }, '*');
            }
        }

    };

    self.onMessage = function(e) {
        // console.log('our stack', self.stack);
        found = false;
        // LOOK IN STACK
        for (var s in self.stack) {
            if (self.stack[s].req === e.data.req && typeof self.stack[s].cb === 'function') {
                // console.log('we got the stack element : ', self.stack[s], e.data);
                self.stack[s].cb(e.data);
                // and remove element from stack
                self.stack.splice(s, 1);
                found = true;
                // console.log('stack updated !', self.stack);
                break;
            }
        }

        if (!found) {
            for (var i = self.global_watchers.length - 1; i >= 0; i--) {
                if (e.data && self.global_watchers[i].key === e.data.req && typeof self.global_watchers[i].action === 'function') {
                    self.global_watchers[i].action(e.data.data);
                    break;
                }
            }
        }

        found = false;
    };

    self.get = function(_req, _cb, __cb) {

        if (self.request_list.indexOf(_req) > -1) {
            self.stack.push({
                req: _req,
                data: typeof _cb !== 'function' ? _cb : {},
                cb: (typeof _cb === 'function') ? _cb : __cb
            });
            self.post(_req, typeof _cb !== 'function' ? _cb : {});
        }

        // _cb could host data
        // if (self.request_list.indexOf(_req) > -1) {
        //     $window.top.postMessage({
        //         req: _req,
        //         data: typeof _cb !== 'function' ? _cb : {}
        //     }, '*');

        //     $window.onmessage = function(e) {
        //         console.log('got message in angular : ', e);
        //         if (e.data && e.data.success === true && e.data.req === _req) {
        //             console.log('A');
        //             if (typeof _cb === 'function') {
        //                 console.log('B');
        //                 _cb(e.data);
        //             } else if (typeof __cb === 'function') {
        //                 console.log('C');
        //                 __cb(e.data);
        //             } else {
        //                 console.log('D');
        //             }
        //         } else if (!self.global_watchers_init) {
        //             console.log('E', {
        //                 e_data: e.data,
        //                 e_data_success: e.data.success === true,
        //                 e_data_req: e.data.req,
        //                 cb: _cb
        //             });
        //             for (var i = self.global_watchers.length - 1; i >= 0; i--) {
        //                 if (e.data && self.global_watchers[i].key === e.data.req && typeof self.global_watchers[i].action === 'function') {
        //                     console.log('F');
        //                     self.global_watchers[i].action(e.data.data);
        //                     break;
        //                 }
        //             }
        //         }

        //         // global watchers
        //     };

        // } else {
        //     console.log('error : request undefined..');
        // }
    };

    window.onmessage = self.onMessage;

}]);