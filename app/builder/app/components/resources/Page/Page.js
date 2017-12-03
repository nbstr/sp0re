//Resource Page
var Page = angular.module("PageModule", []);

Page.factory("Page", ['$rootScope', '$q', 'ApiService', 'atmosphere', function($rootScope, $q, ApiService, atmosphere) {

    var PageResource = {};

    /****************************************************************************
     *                                                                          *
     * Resource Page                                                            *
     * Explain what the method of the resource does here                        *
     *                                                                          *
     ***************************************************************************/

    PageResource.siteUrlClamp = function(_array) {
        var __index;
        for (var e in _array) {
            if (_array[e] && _array[e].page && _array[e].page.u) {
                _array[e].page._u = _array[e].page.u;
                if (_array[e].page.site) {
                    __index = _array[e].page._u.indexOf(_array[e].page.site) + _array[e].page.site.length;
                    _array[e].page._u = _array[e].page._u.slice(__index)
                }
            }
        }
        return _array;
    };

    PageResource.get = function(__location, __reset) {

        // RETURNS (error, data);
        // if @param _location not provided, we will get it by asking the parent window of the iframe

        var q = $q.defer();

        if (!$rootScope.GLOBAL.entry_request.loaded || __reset) {

            if (__reset) {
                $rootScope.GLOBAL.entry_request.offset_index = 0;
                $rootScope.GLOBAL.page = null;
                $rootScope.GLOBAL.page_data = null;
            }

            if (!$rootScope.PAGE_CONTENT_LOADING) {

                $rootScope.loading();
                $rootScope.PAGE_CONTENT_LOADING = true;

                var _continue = function(_location) {

                    // ADDING REQUIRED PARAMETERS TO LOCATION OBJECT : top level domain, domain, sub domain.
                    _location._domain = helper.splitHostname(_location.hostname);
                    
                    // ADDING FAVICON TO LOCATION OBJECT
                    _location.favicon = helper.getFavicon(_location.hostname);

                    // SET LOCATION TO ROOTSCOPE
                    $rootScope.GLOBAL.location = _location;
                    $rootScope.GLOBAL.site = _location.hostname;

                    // PARAMS
                    var userId = $rootScope.USER.nfo().id;
                    var get_params = _location;
                    get_params.limit = $rootScope.GLOBAL.entry_request.limit;
                    get_params.offset = $rootScope.GLOBAL.entry_request.offset_index * $rootScope.GLOBAL.entry_request.limit;

                    ApiService.request('page.check', get_params).then(function(data) {

                        console.log('PAGE GET : ', data.result);

                        // if first time, init data, otherwise, concat entries with old ones
                        if (!data.result) {
                            $rootScope.GLOBAL.page_data = { entries: [] };
                        } else if (!$rootScope.GLOBAL.page_data) {
                            $rootScope.GLOBAL.page = data.result.id;
                            $rootScope.GLOBAL.page_data = data.result;
                        } else {
                            if (!$rootScope.GLOBAL.page) {
                                $rootScope.GLOBAL.page = data.result.id;
                            }
                            $rootScope.GLOBAL.page_data.entries = $rootScope.GLOBAL.page_data.entries.concat(data.result.entries);
                        }

                        // check if we got all data
                        if ((data.result && data.result.entries.length < $rootScope.GLOBAL.entry_request.limit) || !data.result) {
                            $rootScope.GLOBAL.entry_request.loaded = true;
                        } else {
                            $rootScope.GLOBAL.entry_request.offset_index++;
                        }

                        // user upvoted
                        if (userId) {
                            for (var e in $rootScope.GLOBAL.page_data.entries) {
                                $rootScope.GLOBAL.page_data.entries[e].upvoted = $rootScope.GLOBAL.page_data.entries[e].upvotes.indexOf(userId) > -1;
                            }
                        }

                        console.log('DATAA', $rootScope.GLOBAL.page_data)

                        next(!data.success, data.result);

                        // PageResource.process(data, function(_error, _response){
                        //     atmosphere.get(_response.bubble);
                        //     $rootScope.GLOBAL.page_data = _response.data;
                        //     $rootScope.GLOBAL.page = _response.data.id;
                        //     next(_error, _response.data);
                        // });

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
        } else {
            q.resolve();
        }

        return q.promise;

    };

    PageResource.process = function(data, next) {
        var _response = {
            bubble: '',
            data: {}
        };
        // success
        if (data && data.success) {

            // get user data
            var userId = $rootScope.USER.nfo().id;

            // init bubble icon display
            var unansweredFound = false,
                commentsFound = false,
                reportsCount = 0;

            // clean entries
            for (var e in data.result) {
                if (userId) {
                    data.result[e].upvoted = data.result[e].upvotes.indexOf(userId) > -1;
                }
                if (!data.result[e].helpful_answer && data.result[e].type === 'question') {
                    unansweredFound = true;
                }
                if (data.result[e].type === 'report') {
                    reportsCount++;
                }
                if (true) {
                    // TODO add necessary validation
                    commentsFound = true;
                }
            }

            // manage bubble icon
            if (reportsCount > 3) {
                _response.bubble = 'action:danger';
            } else if (unansweredFound) {
                _response.bubble = 'action:question';
            } else if (commentsFound) {
                _response.bubble = 'action:comment';
            } else {
                _response.bubble = 'action:void';
            }

            // PROCESS DATA
            _response.data.entries = PageResource.siteUrlClamp(data.result);

            // console.log('success : ', data.result);
            next(null, _response);

        }

        // ERROR getting page, maybe display error page
        else {

            next('Something wrong happened.. Try again later..');
        }
    };

    PageResource.getSite = function() {

        var q = $q.defer();

        ApiService.request('page.site', {
            hostname: $rootScope.GLOBAL.site,
            page: $rootScope.GLOBAL.page
        }).then(function(data) {

            PageResource.process(data, function(error, _response) {
                q.resolve(error ? [] : _response.data);
            });


        }, function(serverError) {
            // TODO server error getting page, maybe display error page
            console.log('server error : ', serverError);
            // TODO maybe try to reconnect
            next('We lost the connection..');
        });

        return q.promise;

    };

    PageResource.getSiteData = function() {

        var q = $q.defer();

        ApiService.request('site.get', {
            hostname: $rootScope.GLOBAL.site,
            page: $rootScope.GLOBAL.page
        }).then(function(data) {

            PageResource.process(data, function(error, _response) {
                q.resolve(error ? [] : _response.data);
            });


        }, function(serverError) {
            // TODO server error getting page, maybe display error page
            console.log('server error : ', serverError);
            // TODO maybe try to reconnect
            next('We lost the connection..');
        });

        return q.promise;

    };

    PageResource.getSiteInfo = function() {

        var q = $q.defer();

        ApiService.request('site.getInfo', {
            hostname: $rootScope.GLOBAL.site,
            page: $rootScope.GLOBAL.page
        }).then(function(data) {

            if(data && data.result) {
                $rootScope.GLOBAL.allow_create_entries = data.result.visitor_post;
                $rootScope.GLOBAL.allow_question_answer = data.result.question_answer;
            }

            q.resolve(data);


        }, function(serverError) {
            // TODO server error getting page, maybe display error page
            console.log('server error : ', serverError);
            // TODO maybe try to reconnect
            next('We lost the connection..');
        });

        return q.promise;

    };

    // NEED IT IN ATMOSPHERE..
    $rootScope.PageResource = PageResource;

    return PageResource;

}]);