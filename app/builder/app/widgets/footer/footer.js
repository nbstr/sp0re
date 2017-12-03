//Widget footer
var footer = angular.module("footerWidget", []);

//constant
footer.constant("footerLocal", {
    "template": "html/footer.html"
});
footer.run(['$rootScope', '$http', '$templateCache', 'footerLocal', function($rootScope, $http, $templateCache, local) {
    $http.get(local.template, { cache: $templateCache });
}]);
//preload template once for all

//controller
footer.controller("FooterController", ['$scope', '$rootScope', '$http', '$timeout', 'Comment', 'Question', 'Report', 'Page', 'Entry', function($scope, $rootScope, $http, $timeout, Comment, Question, Report, Page, Entry) {

    $scope.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    $scope.provide('addEmoji', function(_emoji) {
        $rootScope.$broadcast('insertAtCaret:home', _emoji);
        $rootScope.FOOTER.switchEmoji();

    });

    $scope.provide('createEntry', function() {

        if ($rootScope.FOOTER.content && $rootScope.FOOTER.content.text) {
            if (helper.inArray($rootScope.FOOTER.type, config.app.entry.types)) {

                Entry.create($rootScope.FOOTER.type, $rootScope.FOOTER.content).then(function(data) {

                    data.user = $rootScope.USER.nfo();

                    console.log('data : ', data);

                    $rootScope.GLOBAL.page_data.entries.unshift(data);

                    // RESET
                    $rootScope.FOOTER.content.text = '';
                    $rootScope.FOOTER.content.code_snippet = '';
                    $rootScope.FOOTER.blur();

                    $rootScope.GLOBAL.page_data.entries[0].fresh = true;
                    $timeout(function() {
                        $rootScope.GLOBAL.page_data.entries[0].fresh = false;
                    }, 3000);

                });
                $('.app-wrapper').animate({ scrollTop: 0 }, 500);

            } else if ($rootScope.FOOTER.type === 'reply' && $rootScope.FOOTER.data.type) {
                var _data = {
                    txt: $rootScope.FOOTER.content.text,
                    type: $rootScope.FOOTER.data.type,
                    id: $rootScope.FOOTER.data.id,
                    user: $rootScope.FOOTER.data.user && $rootScope.FOOTER.data.user.id ? $rootScope.FOOTER.data.user.id : $rootScope.FOOTER.data.user
                };
                Entry.reply(_data.txt, _data.id, _data.user).then(function(data) {
                    console.log('replied : ', data);
                    $rootScope.FOOTER.blur(function() {
                        $rootScope.FOOTER.content.text = '';
                        $rootScope.FOOTER.content.code_snippet = '';
                        $rootScope.changeState('root.entryDetail', 'move-left', { 'id': _data.id, 'type': _data.type, 'ncr': data.id });
                    });
                });
            }
        }
    });

    $scope.provide('createEntryBackup', function() {
        var _model = (($rootScope.FOOTER.type === 'comment') ? Comment : (($rootScope.FOOTER.type === 'question') ? Question : (($rootScope.FOOTER.type === 'report') ? Report : null)));
        if ($rootScope.FOOTER.content && $rootScope.FOOTER.content.text) {
            if ('comment,question,report'.split(',').indexOf($rootScope.FOOTER.type) > -1) {
                var _key = $rootScope.FOOTER.type + 's';
                _model.create($rootScope.FOOTER.content).then(function(data) {

                    if (!$rootScope.GLOBAL.page_data[_key]) {
                        $rootScope.GLOBAL.page_data[_key] = [];
                    }
                    $rootScope.GLOBAL.page_data.all.unshift(data);
                    $rootScope.GLOBAL.page_data[_key].unshift(data);

                    // RESET
                    $rootScope.FOOTER.content.text = '';
                    $rootScope.FOOTER.blur();

                    for (var e in $rootScope.GLOBAL.page_data[_key]) {
                        if ($rootScope.GLOBAL.page_data[_key][e].id === data.id) {
                            $rootScope.GLOBAL.page_data[_key][e].fresh = true;
                            $timeout(function() {
                                $rootScope.GLOBAL.page_data[_key][e].fresh = false;
                            }, 3000);
                            break;
                        }
                    }

                });
                $('.app-wrapper').animate({ scrollTop: 0 }, 500);

            } else if ($rootScope.FOOTER.type === 'reply' && $rootScope.FOOTER.data.type && $rootScope.FOOTER.data.user) {
                var _data = {
                    txt: $rootScope.FOOTER.content.text,
                    type: $rootScope.FOOTER.data.type,
                    id: $rootScope.FOOTER.data.id,
                    user: $rootScope.FOOTER.data.user.id ? $rootScope.FOOTER.data.user.id : $rootScope.FOOTER.data.user
                };
                _model = ((_data.type === 'comment') ? Comment : ((_data.type === 'question') ? Question : ((_data.type === 'report') ? Report : null)));
                if (_model) {
                    _model.reply(_data.txt, _data.id, _data.user, true).then(function(data) {
                        console.log('replied : ', data);
                        $rootScope.FOOTER.blur(function() {
                            $rootScope.changeState('root.entryDetail', 'move-left', { 'id': _data.id, 'type': _data.type, 'ncr': data.id });
                        });
                    });
                }
            }
        }
    });

    $scope.provide('reload', function(cb) {
        Page.get().then(cb, cb);
    });

    $scope.provide('insertAtCaret', function insertAtCaret(areaId, text) {
        var txtarea = document.getElementById(areaId);
        if (!txtarea) {
            return;
        }

        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false));
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart('character', -txtarea.value.length);
            strPos = range.text.length;
        } else if (br == "ff") {
            strPos = txtarea.selectionStart;
        }

        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(strPos, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        if (br == "ie") {
            txtarea.focus();
            var ieRange = document.selection.createRange();
            ieRange.moveStart('character', -txtarea.value.length);
            ieRange.moveStart('character', strPos);
            ieRange.moveEnd('character', 0);
            ieRange.select();
        } else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }

        txtarea.scrollTop = scrollPos;

    });

    $scope.provide('init', function() {
        $rootScope.FOOTER.type = 'comment';
        $scope._USER = $rootScope.USER.nfo();

        $scope.footer_class = {
            class: function() {
                return {
                    'comment': $rootScope.FOOTER.type === 'comment',
                    'reply': $rootScope.FOOTER.type === 'reply',
                    'question': $rootScope.FOOTER.type === 'question',
                    'report': $rootScope.FOOTER.type === 'report',
                    'active': $rootScope.FOOTER.active
                }
            },
            btn_class: function() {
                return {
                    'comment': $rootScope.FOOTER.type === 'comment',
                    'reply': $rootScope.FOOTER.type === 'reply',
                    'question': $rootScope.FOOTER.type === 'question',
                    'report': $rootScope.FOOTER.type === 'report',
                    'active': $rootScope.FOOTER.active,
                    'invalid': !$rootScope.FOOTER.content.text
                }
            },
            arrow_position: function() {
                return {
                    'left': $rootScope.FOOTER.type === 'comment' ? '20%' : ($rootScope.FOOTER.type === 'question' ? '70%' : '50%')
                }
            }
        };
    });

    $scope.init();
}]);

//directive
footer.directive("footer", ['$rootScope', 'footerLocal', function($rootScope, local) {
    return {
        restrict: 'A',
        controller: 'FooterController',
        templateUrl: local.template,
        link: function(scope, element, attrs) {
            var watcher = $rootScope.$watch('FOOTER');

            scope.$on("$destroy", function() {
                watcher();
            });
        }
    };
}]);