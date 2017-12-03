//Resource Entry
var Entry = angular.module("EntryModule", []);

Entry.factory("Entry", ['$rootScope', '$q', 'ApiService', function($rootScope, $q, ApiService) {

    var EntryResource = {
        provide: function(name, fn) {
            this[name] = safelyProvide(fn);
        }
    };

    /****************************************************************************
     *                                                                          *
     * Resource Entry                                                           *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    EntryResource.provide('refreshUpVotes', function(type, data, key_array) {
        var user_id = $rootScope.USER.nfo().id;

        // REFRESH PARENT OBJECT UPVOTES

        // CREATE UPVOTES ARRAY IF DOES NOT EXIST
        if (!data.upvotes) {
            data.upvotes = [];
        }
        data.upvoted = user_id && data.upvotes.indexOf(user_id) > -1;

        // CACHE DATA
        if (!$rootScope.dataCache) {
            $rootScope.dataCache = {};
        }
        if (!$rootScope.dataCache[type]) {
            $rootScope.dataCache[type] = {};
        }
        $rootScope.dataCache[type][data.id] = data;

        if (key_array && data[key_array]) {

            // REFRESH UPVOTES IN SUB ARRAY
            for (var e in data[key_array]) {
                if (!data[key_array][e].upvotes) {
                    data[key_array][e].upvotes = [];
                }
                data[key_array][e].upvoted = user_id && data[key_array][e].upvotes.indexOf(user_id) > -1;
            }

        }

        return data;

    });

    EntryResource.provide('page', function(__location) {

        // RETURNS (error, data);
        // if @param _location not provided, we will get it by asking the parent window of the iframe

        var q = $q.defer();

        if (!$rootScope.PAGE_CONTENT_LOADING) {

            $rootScope.loading();
            $rootScope.PAGE_CONTENT_LOADING = true;

            var _continue = function(_location) {

                // ADDING REQUIRED PARAMETERS TO LOCATION OBJECT : top level domain, domain, sub domain.
                var splitHostname = _location.hostname.split('.');
                _location._domain = {
                    tld: splitHostname[splitHostname.length - 1],
                    d: splitHostname[splitHostname.length - 2],
                    sd: splitHostname.length > 2 ? splitHostname[splitHostname.length - 3] : null
                };
                // ADDING FAVICON TO LOCATION OBJECT
                _location.favicon = helper.getFavicon(_location.hostname);

                // SET LOCATION TO ROOTSCOPE
                $rootScope.GLOBAL.location = _location;
                $rootScope.GLOBAL.site = _location.hostname;

                // PARAMS
                var get_params = _location;
                get_params.limit = 10;
                get_params.offset = 0;

                ApiService.request('page.check', get_params).then(function(data) {

                    PageResource.process(data, function(_error, _response) {
                        atmosphere.get(_response.bubble);
                        $rootScope.GLOBAL.page_data = _response.data;
                        $rootScope.GLOBAL.page = _response.data.id;
                        next(_error, _response.data);
                    });

                }, function(serverError) {
                    // TODO server error getting page, maybe display error page
                    console.log('server error : ', serverError);
                    // TODO maybe try to reconnect
                    next('We lost the connection..');
                });
            };

            var next = function(error, data) {

                if (error) {
                    $rootScope.showErrorModal(error);
                }

                if (!$rootScope.app_loaded) {
                    $rootScope.app_loaded = true;
                }

                $rootScope.PAGE_CONTENT_LOADING = false;
                $rootScope.loaded();
                q.resolve(error, data);
            };

            if (!__location) {
                if ($rootScope.GLOBAL.location) {
                    _continue($rootScope.GLOBAL.location);
                } else {
                    if (window.location.hostname == 'localhost') {
                        // adding local dev version, in case we are working on localhost and thus there is no extension.
                        // working with sample location (inklabs.be)
                        _continue(config.app.ifrm_env.get());

                    } else {
                        atmosphere.get('location', function(response) {
                            _continue(response.location);
                        });

                    }
                }
            } else {
                _continue(__location);
            }
        } else {
            q.resolve();
        }

        return q.promise;
    });

    EntryResource.provide('get', function(id) {

        var q = $q.defer();

        ApiService.request('entry.get', {
            id: id
        }).then(function(data) {
            if (data && data.success) {

                // var __data = EntryResource.refreshUpVotes(_data.type, data.result, 'answers');
                // var user_id = $rootScope.USER.nfo().id;
                // __data.type = _data.type;

                // // QUESTION SPECIFIC
                // // checking the answer for accepted ones and setting up .helpful boolean attribute.
                // // WARN:QUESTION:MULTIPLE.ANSWERS.ACCEPTED this loop only allows one answer that is stored in the question object..
                // for (var e in __data.answers) {
                //     if (_data.type === 'question') {
                //         __data.answers[e].helpful = (__data.helpful_answer === __data.answers[e].id);
                //     }
                //     if (user_id) {
                //         if (__data.answers[e].user && __data.answers[e].user.id) {
                //             __data.answers[e]._me = (user_id === __data.answers[e].user.id);
                //         } else if (__data.answers[e].user) {
                //             __data.answers[e]._me = (user_id === __data.answers[e].user);
                //         }
                //     }
                // }

                q.resolve(data.result);

            } else {
                $rootScope.showErrorModal('An error occured, please excuse us..', function() {
                    $rootScope.goBack('move-right');
                });
                q.reject();
            }

        });

        return q.promise;
    });

    EntryResource.provide('search', function(text) {

        var q = $q.defer();

        ApiService.request('entry.search', {
            text: text,
            site: $rootScope.GLOBAL.site
        }).then(function(data) {
            if (data && data.success) {

                q.resolve(data.result);

            } else {
                $rootScope.showErrorModal('An error occured, please excuse us..');
                q.reject();
            }

        });

        return q.promise;
    });

    EntryResource.provide('getBackup', function(_data) {

        var q = $q.defer();

        ApiService.request(_data.route, {
            id: _data.data.id
        }).then(function(data) {
            if (data && data.success) {

                var __data = EntryResource.refreshUpVotes(_data.data.type, data.result, 'answers');
                var user_id = $rootScope.USER.nfo().id;
                __data.type = _data.data.type;

                // QUESTION SPECIFIC
                // checking the answer for accepted ones and setting up .helpful boolean attribute.
                // WARN:QUESTION:MULTIPLE.ANSWERS.ACCEPTED this loop only allows one answer that is stored in the question object..
                for (var e in __data.answers) {
                    if (_data.data.type === 'question') {
                        __data.answers[e].helpful = (__data.helpful_answer === __data.answers[e].id);
                    }
                    if (user_id) {
                        if (__data.answers[e].user && __data.answers[e].user.id) {
                            __data.answers[e]._me = (user_id === __data.answers[e].user.id);
                        } else if (__data.answers[e].user) {
                            __data.answers[e]._me = (user_id === __data.answers[e].user);
                        }
                    }
                }

                q.resolve(__data);

            } else {
                $rootScope.showErrorModal('An error occured, please excuse us..', function() {
                    $rootScope.goBack('move-right');
                });
                q.reject();
            }

        });

        return q.promise;
    });

    EntryResource.provide('getAnswerParent', function(id) {

        var q = $q.defer();

        ApiService.request('entry.answer_parent', {
            id: id
        }).then(function(data) {
            if (data && data.success) {

                if (data.result) {
                    if (data.result.question) {
                        data.result.type = 'question';
                    } else if (data.result.comment) {
                        data.result.type = 'comment';
                    } else if (data.result.report) {
                        data.result.type = 'report';
                    }
                } else {
                    q.reject();
                }

                q.resolve(data.result);

            } else {
                q.reject();
            }

        });

        return q.promise;
    });

    EntryResource.provide('create', function(_type, _content) {
        var q = $q.defer();

        $rootScope.USER.ifConnectedOrAllowCreate(function() {

            _content.code_snippet_lg = $rootScope.ace_config.mode;

            var __data = {
                content: _content,
                type: _type,
                location: $rootScope.GLOBAL.location,
                favicon: helper.getFavicon($rootScope.GLOBAL.location.hostname)
                    // referrer: document.referrer,
                    // user_agent: navigator.userAgent
            };

            if ($rootScope.GLOBAL.page) {
                __data.page = $rootScope.GLOBAL.page;
            }

            ApiService.request('entry.create', __data).then(function(data) {
                if (data && data.success) {
                    console.log('entry created : ', data.result);
                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('upvote', function(_data) {
        var q = $q.defer();

        $rootScope.USER.ifConnected(function() {

            ApiService.request('entry.upvote', {
                type: _data.type,
                location: $rootScope.GLOBAL.location,
                id: _data.id,
                upvote: _data.upvote
            }).then(function(data) {

                if (data && data.success) {

                    if (_data.type === 'comment' || _data.type === 'question' || _data.type === 'report') {
                        var _update = EntryResource.refreshUpVotes(_data.type, data.result);
                        data.result.upvotes = _update.upvotes;
                        data.result.upvoted = _update.upvoted;
                        for (var E in $rootScope.GLOBAL.page_data.entries) {
                            if ($rootScope.GLOBAL.page_data.entries[E].id === _data.id) {
                                // find entry in array to update it
                                $rootScope.GLOBAL.page_data.entries[E].upvotes = _update.upvotes;
                                $rootScope.GLOBAL.page_data.entries[E].upvoted = _update.upvoted;
                                break;
                            }
                        }
                        q.resolve(data.result);
                    } else {
                        q.resolve(EntryResource.refreshUpVotes(_data.type, data.result));
                    }


                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('reply', function(text, entry_id, author_id) {
        var q = $q.defer();

        $rootScope.USER.ifConnectedOrAllowCreate(function() {

            // make necessary verifications
            ApiService.request('entry.reply', {
                location: $rootScope.GLOBAL.location,
                content: {
                    text: text,
                    entry: entry_id,
                    author: author_id
                }
                // referrer: document.referrer,
                // user_agent: navigator.userAgent
            }).then(function(data) {

                if (data && data.success) {

                    // add to count !! TODO

                    for (var E in $rootScope.GLOBAL.page_data.entries) {
                        if ($rootScope.GLOBAL.page_data.entries[E].id === entry_id) {
                            // find entry in array to update it
                            $rootScope.GLOBAL.page_data.entries[E].answerCount++;
                            break;
                        }
                    }

                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('hide', function(entry) {
        var q = $q.defer();

        $rootScope.USER.ifConnected(function() {

            // make necessary verifications
            ApiService.request('entry.hide', {
                id: entry.id
            }).then(function(data) {

                if (data && data.success) {

                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('hideAnswer', function(entry) {
        var q = $q.defer();

        $rootScope.USER.ifConnected(function() {

            // make necessary verifications
            ApiService.request('entry.hideAnswer', {
                id: entry.id
            }).then(function(data) {

                if (data && data.success) {

                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('delete', function(entry) {
        var q = $q.defer();

        $rootScope.USER.ifConnected(function() {

            // make necessary verifications
            ApiService.request('entry.delete', {
                id: entry.id
            }).then(function(data) {

                if (data && data.success) {

                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    EntryResource.provide('deleteAnswer', function(entry) {
        var q = $q.defer();

        $rootScope.USER.ifConnected(function() {

            // make necessary verifications
            ApiService.request('entry.deleteAnswer', {
                id: entry.id
            }).then(function(data) {

                if (data && data.success) {

                    q.resolve(data.result);

                } else {
                    $rootScope.showErrorModal('An error occured, please excuse us..');
                    q.reject();
                }

            });

        }, q.reject);

        return q.promise;

    });

    // EntryResource.provide('createBackup', function(_data) {
    //     var q = $q.defer();

    //     $rootScope.USER.ifConnected(function() {

    //         ApiService.request(_data.route, {
    //             location: _data.data.location,
    //             type: _data.data.type,
    //             content: _data.data.content,
    //             // referrer: document.referrer,
    //             // user_agent: navigator.userAgent
    //         }).then(function(data) {
    //             if (data && data.success) {
    //                 q.resolve(data.result);

    //             } else {
    //                 $rootScope.showErrorModal('An error occured, please excuse us..');
    //                 q.reject();
    //             }

    //         });

    //     }, q.reject);

    //     return q.promise;

    // });

    return EntryResource;

}]);