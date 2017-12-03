//Resource UserNotifications
var UserNotifications = angular.module("UserNotificationsModule", []);

UserNotifications.factory("UserNotifications", ['$rootScope', 'ApiService', '$q', function($rootScope, ApiService, $q) {

    var UserNotificationsResource = {
        config: {
            max_description_length: 30
        }
    };

    /****************************************************************************
     *                                                                          *
     * Resource UserNotifications                                               *
     *                                                                          *
     ***************************************************************************/

    UserNotificationsResource.formatNotifications = function(notifications) {

        // FORMAT
        // - notifications
        // - unreads : BOOL

        if (!notifications) { notifications = []; }
        var unreads = false;
        // CHECK DATE CORRESPONDANCE
        var last_read = $rootScope.USER.nfo().last_read_notifications;

        // NAVIGATION
        // this function allow to redirect to a specific answer on an entry detail page
        var entryDetail = function(_notification) {
            var _models = ['answer', 'answer_id'],
                found = false;
            for (var e in _models) {
                if (_notification[_models[e]]) {
                    found = _notification[_models[e]];
                    break;
                }
            }
            if (!found) {
                rootEntryDetail(_notification);
            } else {
                console.log('NOTIFICATION : ', _notification);
                $rootScope.changeState('root.entryDetail', ($rootScope.currentState === 'root.entryDetail' ? 'fade' : 'move-left'), { 'id': found, 'type': 'answer', 'ncr': found });
            }
        };
        // this function allow to redirect to a specific entry detail page
        var rootEntryDetail = function(_notification) {
            console.log('NOTIFICATION : ', _notification);
            var _models = ['entry', 'entry_id', 'comment', 'question', 'report'];
            var _params = {
                'type': 'entry'
            };
            for (var e in _models) {
                if (_notification[_models[e]]) {
                    _params.id = _notification[_models[e]];
                    break;
                }
            }
            if (_notification.answer) { _params.ncr = _notification.answer; }
            $rootScope.changeState('root.entryDetail', ($rootScope.currentState === 'root.entryDetail' ? 'fade' : 'move-left'), _params);
        };

        // DEFAULT IMAGE
        // if no user picture provided, use the basic one
        var _defaultImage = function(_img) {
            return _img ? _img : config.app.default_user_picture;
        };

        if (!last_read) {
            unreads = true;
            last_read = new Date();
        }

        for (var i = notifications.length - 1; i >= 0; i--) {

            // ██╗   ██╗███╗   ██╗██████╗ ███████╗ █████╗ ██████╗ ███████╗
            // ██║   ██║████╗  ██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝
            // ██║   ██║██╔██╗ ██║██████╔╝█████╗  ███████║██║  ██║███████╗
            // ██║   ██║██║╚██╗██║██╔══██╗██╔══╝  ██╔══██║██║  ██║╚════██║
            // ╚██████╔╝██║ ╚████║██║  ██║███████╗██║  ██║██████╔╝███████║
            //  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
            if ((new Date(notifications[i].updatedAt)).getTime() > (new Date(last_read)).getTime()) {
                unreads = true;
            }

            // ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
            // ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
            // ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  
            // ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  
            // ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
            //  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝
            if (notifications[i].type === 'user.register') {
                // CONTENT
                notifications[i].txt = $rootScope.getContentReplace('n.user_register', {
                    name: $rootScope.setUsername(notifications[i].metadata.user[0]),
                    points: helper.alt(notifications[i].metadata.user[0].points, 'some')
                });
                // ASSETS
                notifications[i].img = 'assets/bubbles/hey.png';
                notifications[i].icon = 'assets/coin.png';
                notifications[i].date = notifications[i].updatedAt;
                continue;
            }

            //  ███╗  ███╗       ███████╗███╗   ██╗████████╗██████╗ ██╗   ██╗
            // █████╗█████╗      ██╔════╝████╗  ██║╚══██╔══╝██╔══██╗ ██╗ ██╔╝
            //  █████████╔╝      █████╗  ██╔██╗ ██║   ██║   ██████╔╝  ████╔╝ 
            //   ███████╔╝       ██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗   ██╔╝  
            //    ╚███╔═╝        ███████╗██║ ╚████║   ██║   ██║  ██║   ██║   
            //     ╚══╝          ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   
            else if (notifications[i].type === 'entry.upvote') {
                if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                    var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids),
                        metadata = notifications[i].metadata;
                    // CONTENT
                    if (!metadata.blurb || !metadata.blurb[0] || !metadata.url || !metadata.url[0]) {
                        notifications[i].txt = $rootScope.getContentReplace('n.entry_upvote', {
                            name: _names.txt
                        });
                    } else {
                        notifications[i].txt = $rootScope.getContentReplace('n.entry_upvote_blurb', {
                            name: _names.txt,
                            blurb: helper.blurb(notifications[i].metadata.blurb[0], UserNotificationsResource.config.max_description_length),
                            url: notifications[i].metadata.url[0]
                        });
                    }
                    // ASSETS
                    notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].action = rootEntryDetail;

                } else {
                    notifications[i].hide = true;
                }
                continue;
            }

            //  ███╗  ███╗        █████╗ ███╗   ██╗███████╗██╗    ██╗███████╗██████╗ 
            // █████╗█████╗      ██╔══██╗████╗  ██║██╔════╝██║    ██║██╔════╝██╔══██╗
            //  █████████╔╝      ███████║██╔██╗ ██║███████╗██║ █╗ ██║█████╗  ██████╔╝
            //   ███████╔╝       ██╔══██║██║╚██╗██║╚════██║██║███╗██║██╔══╝  ██╔══██╗
            //    ╚███╔═╝        ██║  ██║██║ ╚████║███████║╚███╔███╔╝███████╗██║  ██║
            //     ╚══╝          ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝
            else if (notifications[i].type === 'answer.upvote') {
                if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                    var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids),
                        metadata = notifications[i].metadata;

                    // CONTENT
                    if (!metadata.blurb || !metadata.blurb[0] || !metadata.url || !metadata.url[0]) {
                        notifications[i].txt = $rootScope.getContentReplace('n.answer_upvote', {
                            name: _names.txt
                        });
                    } else {
                        notifications[i].txt = $rootScope.getContentReplace('n.answer_upvote_blurb', {
                            name: _names.txt,
                            blurb: helper.blurb(notifications[i].metadata.blurb[0], UserNotificationsResource.config.max_description_length),
                            url: notifications[i].metadata.url[0]
                        });
                    }
                    // ASSETS
                    notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].action = entryDetail;

                } else {
                    notifications[i].hide = true;
                }
                continue;
            }

            // ██████╗ ███████╗██████╗       ███████╗███╗   ██╗████████╗██████╗ ██╗   ██╗
            // ██╔══██╗██╔════╝██╔══██╗      ██╔════╝████╗  ██║╚══██╔══╝██╔══██╗ ██╗ ██╔╝
            // ██████╔╝█████╗  ██████╔╝      █████╗  ██╔██╗ ██║   ██║   ██████╔╝  ████╔╝ 
            // ██╔══██╗██╔══╝  ██╔═══╝       ██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗   ██╔╝  
            // ██║  ██║███████╗██║           ███████╗██║ ╚████║   ██║   ██║  ██║   ██║   
            // ╚═╝  ╚═╝╚══════╝╚═╝           ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   
            else if (notifications[i].type === 'entry.answer' || notifications[i].type === 'answer') {
                if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                    var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids),
                    metadata = notifications[i].metadata;
                    
                    // CONTENT
                    if (!metadata.blurb || !metadata.blurb[0] || !metadata.url || !metadata.url[0]) {
                        notifications[i].txt = $rootScope.getContentReplace('n.entry_answer', {
                            name: _names.txt
                        });
                    } else {
                        notifications[i].txt = $rootScope.getContentReplace('n.entry_answer_blurb', {
                            name: _names.txt,
                            blurb: helper.blurb(notifications[i].metadata.blurb[0], UserNotificationsResource.config.max_description_length),
                            url: notifications[i].metadata.url[0]
                        });
                    }
                    // ASSETS
                    notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].action = entryDetail;
                } else {
                    notifications[i].hide = true;
                }
                continue;
            }












            // ██████╗ ███████╗██████╗ ██████╗ ███████╗ ██████╗ █████╗ ████████╗███████╗██████╗ 
            // ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
            // ██║  ██║█████╗  ██████╔╝██████╔╝█████╗  ██║     ███████║   ██║   █████╗  ██║  ██║
            // ██║  ██║██╔══╝  ██╔═══╝ ██╔══██╗██╔══╝  ██║     ██╔══██║   ██║   ██╔══╝  ██║  ██║
            // ██████╔╝███████╗██║     ██║  ██║███████╗╚██████╗██║  ██║   ██║   ███████╗██████╔╝
            // ╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═════╝ 
            // DEPRECATED :: ANSWERED COMMENT
            else if (notifications[i].type === 'answer.comment.create') {
                if (parseInt(notifications[i].version) === 1) {
                    // V1
                    if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                        var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids);
                        notifications[i].txt = '<strong>' + _names.txt + '</strong> replied to your <strong>comment</strong>.';
                        notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                    } else {
                        notifications[i].img = 'assets/bubbles/hey-w.png';
                        notifications[i].txt = 'You got a notification.';
                        notifications[i].hide = true;
                    }

                    notifications[i].icon = 'assets/question-responded.png';
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].answer_id = notifications[i].answer;
                    notifications[i].action = entryDetail;
                    continue;
                }
            }

            // DEPRECATED :: ANSWERED QUESTION
            else if (notifications[i].type === 'answer.question.create') {
                if (parseInt(notifications[i].version) === 1) {
                    // V1
                    if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                        var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids);
                        notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                        notifications[i].txt = '<strong>' + _names.txt + '</strong> replied to your <strong>question</strong>.';
                    } else {
                        notifications[i].img = 'assets/bubbles/hey-w.png';
                        notifications[i].txt = 'You got a notification.';
                        notifications[i].hide = true;
                    }

                    notifications[i].icon = 'assets/question-responded.png';
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].answer_id = notifications[i].answer;
                    notifications[i].action = entryDetail;
                    continue;
                }
            }

            // DEPRECATED :: ANSWERED REPORT
            else if (notifications[i].type === 'answer.report.create') {
                if (parseInt(notifications[i].version) === 1) {
                    // V1
                    if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                        var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids);
                        notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                        notifications[i].txt = '<strong>' + _names.txt + '</strong> replied to your <strong>report</strong>.';
                    } else {
                        notifications[i].img = 'assets/bubbles/hey-w.png';
                        notifications[i].txt = 'You got a notification.';
                        notifications[i].hide = true;
                    }

                    notifications[i].icon = 'assets/question-responded.png';
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].answer_id = notifications[i].answer;
                    notifications[i].action = entryDetail;
                    continue;
                }
            }

            // DEPRECATED :: UPVOTED ENTRY (COMMENT/QUESTION/REPORT)
            else if (notifications[i].type === 'comment.upvote' || notifications[i].type === 'question.upvote' || notifications[i].type === 'report.upvote') {
                var entry_keys = {
                        'comment.upvote': 'comment',
                        'question.upvote': 'question',
                        'report.upvote': 'report'
                    },
                    entry_key = entry_keys[notifications[i].type];
                if (parseInt(notifications[i].version) === 1) {
                    if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                        var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids);
                        notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                        if (!notifications[i].metadata.blurb || !notifications[i].metadata.blurb[0] || !notifications[i].metadata.url || !notifications[i].metadata.url[0]) {
                            notifications[i].metadata.blurb[0] = (notifications[i].metadata.blurb[0].length > UserNotificationsResource.config.max_description_length) ? (notifications[i].metadata.blurb[0].substring(0, UserNotificationsResource.config.max_description_length) + '…') : (notifications[i].metadata.blurb[0]);
                            notifications[i].txt = '<strong>' + _names.txt + '</strong> <span class="heart"><i></i></span> your <strong>' + entry_key + '</strong>.';
                        } else {
                            notifications[i].txt = '<strong>' + _names.txt + '</strong> <span class="heart"><i></i></span> your <strong>' + entry_key + '</strong>: <em>"' + notifications[i].metadata.blurb[0] + '"</em> on <small>' + notifications[i].metadata.url[0] + '</small>';
                        }

                    } else {
                        notifications[i].img = 'assets/bubbles/hey-w.png';
                        notifications[i].txt = 'You got a notification.';
                        notifications[i].hide = true;
                    }

                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].action = rootEntryDetail;
                    continue;
                }
            }

            // DEPRECATED :: UPVOTED ANSWER (COMMENT/QUESTION/REPORT)
            else if (notifications[i].type === 'answer.question.upvote' || notifications[i].type === 'answer.comment.upvote' || notifications[i].type === 'answer.report.upvote') {
                if (parseInt(notifications[i].version) === 1) {
                    // V1
                    if (notifications[i].metadata.user && notifications[i].metadata.user[0]) {
                        var _names = UserNotificationsResource.manageNames(notifications[i].metadata.user, notifications[i].metadata.user_ids);
                        notifications[i].img = _names.illustration ? _names.illustration : _defaultImage(notifications[i].metadata.user[0].picture);
                        notifications[i].txt = '<strong>' + _names.txt + '</strong> <span class="heart"><i></i></span> your <strong>reply</strong>.';
                    } else {
                        notifications[i].img = 'assets/bubbles/hey-w.png';
                        notifications[i].txt = 'You got a notification.';
                        notifications[i].hide = true;
                    }

                    // notifications[i].icon = 'assets/coin.png';
                    notifications[i].date = notifications[i].updatedAt;
                    notifications[i].answer_id = notifications[i].answer;
                    notifications[i].action = entryDetail;
                    continue;
                }
            }
        }

        return {
            notifications: notifications,
            unreads: unreads
        };

    };

    UserNotificationsResource.manageNames = function(_array_of_objects, _array_of_ids, max_names) {

        max_names = max_names ? max_names : 3;

        function returnName(_object) {
            // first : first_name > last_name
            // then : firstname > last_name > lastname
            // then : username
            // then : nickname
            // then : last_name
            // then : lastname
        }

        if ((!_array_of_ids && !_array_of_objects) || (_array_of_objects.length == 0 && _array_of_ids.length == 0)) {
            return {
                txt: 'No one',
                count: 0
            };
        }

        if (!_array_of_ids) { _array_of_ids = []; }
        if (!_array_of_objects) { _array_of_objects = []; }

        _array_of_ids = _.compact(_.uniq(_array_of_ids));

        var _tmp_names = [];
        var main_illustration = null;
        var _sentense = '';
        var _count = _array_of_ids.length;
        var _just_added = false;

        // PUT GUYS WITH IMAGES FIRST
        if (_array_of_objects.length > 1) {
            var _found = false,
                _index = 0;
            for (var e in _array_of_objects) {
                if (_array_of_objects[e].picture) {
                    _found = true;
                    _index = e;
                    break;
                }
            }
            if (_found && e > 0) {
                _array_of_objects = helper.moveInArray(_array_of_objects, e, 0);
                main_illustration = _array_of_objects[0].picture;
            } else if (_found) {
                main_illustration = _array_of_objects[0].picture;
            }
        }

        for (var e in _array_of_objects) {
            _just_added = false;
            // ignore the ones without id
            if (!_array_of_objects[e].id) {
                continue;
            }

            // username
            if (_array_of_objects[e].username) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].username
                });
            }
            // first_name
            else if (_array_of_objects[e].first_name) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].first_name + (_array_of_objects[e].last_name ? ' ' + _array_of_objects[e].last_name : '')
                });
            }
            // firstname
            else if (_array_of_objects[e].firstname) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].firstname + (_array_of_objects[e].last_name ? ' ' + _array_of_objects[e].last_name : (_array_of_objects[e].lastname ? ' ' + _array_of_objects[e].lastname : ''))
                });
            }
            // nickname
            else if (_array_of_objects[e].nickname) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].nickname
                });
            }
            // last_name
            else if (_array_of_objects[e].last_name) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].last_name
                });
            }
            // lastname
            else if (_array_of_objects[e].lastname) {
                _tmp_names.push({
                    id: _array_of_objects[e].id,
                    name: _array_of_objects[e].lastname
                });
            }
            // someone
            else if (_array_of_ids.indexOf(_array_of_objects[e].id) < 0) {
                _count++;
                _just_added = true;
            }

            // downcount other people
            if (_array_of_ids.indexOf(_array_of_objects[e].id) > -1 && !_just_added) {
                _count--;
            }
        }

        // top to max_names
        var _top;
        if (_tmp_names.length > max_names) {
            count += (_tmp_names.length - max_names);
            _top = max_names;
        } else {
            _top = _tmp_names.length;
        }

        for (var i = 0; i < _top; i++) {
            if (i == 0) {
                _sentense += _tmp_names[i].name;
            } else if (i == (_top - 1) && _count == 0) {
                _sentense += ' and ' + _tmp_names[i].name;
            } else {
                _sentense += ', ' + _tmp_names[i].name;
            }
        }

        if (_count > 0) {
            _sentense += ' and ' + _count + ' other people';
        }

        return {
            txt: _sentense,
            count: _count + _tmp_names.length,
            illustration: main_illustration
        }

        // must return
        // First Last, First and 13 other people
        // First Last
        // First Last, First Last and 1 other people

    };

    return UserNotificationsResource;

}]);