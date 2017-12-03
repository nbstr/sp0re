if (!app) {
    var app = angular.module(config.app.name);
}

app.controller("HomeController", ['$scope', '$rootScope', '$interval', '$timeout', '$http', 'UX', function($scope, $rootScope, $interval, $timeout, $http, UX) {

    $scope.provide = function(name, fn) {
        this[name] = safelyProvide(fn);
    };

    // $scope.provide('getmarketsummaries', function(_mywallet) {
    //     $http.get(helper.u('b/getmarketsummaries')).then(function(_r) {
    //         console.log('_r.data', _r.data);
    //         if (_r && _r.data && _r.data.result) {
    //             $scope._MARKET = [];
    //             $scope.extractCurrencyComp(_r.data.result);
    //             for (var m in _r.data.result) {
    //                 for (var mm in _mywallet) {
    //                     if (_mywallet[mm].Currency === 'BTC' && _r.data.result[m].MarketName === 'USDT-BTC') {
    //                         $scope.USDT_BTC = _r.data.result[m].Last;
    //                         _r.data.result[m].__user = {
    //                             Balance: _mywallet[mm].Balance,
    //                             CryptoAddress: _mywallet[mm].CryptoAddress,
    //                             ccy: 'USDT',
    //                         };
    //                         $scope._MARKET.push(_r.data.result[m]);
    //                     } else if (_r.data.result[m].MarketName === 'BTC-' + _mywallet[mm].Currency) {
    //                         _r.data.result[m].__user = {
    //                             Balance: _mywallet[mm].Balance,
    //                             CryptoAddress: _mywallet[mm].CryptoAddress,
    //                             ccy: 'BTC',
    //                         };
    //                         $scope._MARKET.push(_r.data.result[m]);
    //                     }
    //                 }

    //             }

    //             for (var x in $scope._MARKET) {
    //                 if ($scope._MARKET[x].__user.ccy === 'BTC') {
    //                     $scope._MARKET[x].__user.usdt_balance = $scope._MARKET[x].__user.Balance * $scope.USDT_BTC;
    //                 }
    //             }
    //         }
    //         $scope._MARKET_LOADED = true;
    //         console.log('OK', $scope._MARKET);
    //     });
    // });

    $scope.provide('getmarketsummaries', function(_mywallet) {
        $http.get(helper.u('b/getmarketsummaries')).then(function(_r) {
            console.log('_r.data', _r.data);
            if (_r && _r.data && _r.data.result) {
                $scope._MARKET = [];
                $scope._MARKET = _r.data.result;
                
            }
            $scope._MARKET_LOADED = true;
            console.log('OK', $scope._MARKET);
        });
        $http.get('http://yobit.net/api/3/info').then(function(_r) {
            console.log('YOBIT', _r.data);
        });
    });

    // $scope.provide('USDTBTC', function(_btc, _is_usdt) {
    //     if ($scope.BTC_mode && !_is_usdt) {
    //         return _btc;
    //     } else if ($scope.BTC_mode && _is_usdt) {
    //         return _btc / $scope.USDT_BTC;
    //     } else if (!$scope.BTC_mode && _is_usdt) {
    //         return _btc;
    //     } else if (!$scope.BTC_mode && !_is_usdt) {
    //         return _btc * $scope.USDT_BTC;
    //     }
    // });

    $scope.provide('getbalances', function(_cb) {
        $http.get(helper.u('b/getbalances')).then(function(_r) {
            console.log('_r.data', _r.data);
            if (typeof _cb === 'function' && _r && _r.data && _r.data.result) {
                _cb(_r.data.result);
            }
        });
    });

    $scope.provide('extractCurrencyComp', function(__data){
        var _comp_key = 'Last';
        var _groups = {
            'USDT': {},
            'ETH': {},
            'BTC': {}
        };
        var _defaults = {
            'USDT-BTC': 0,
            'USDT-ETH': 0,
            'BTC-ETH': 0
        };
        var _data = [];

        // group elements
        for(var _m in __data){
            // check if default
            if(_defaults[__data[_m].MarketName]){
                _defaults[__data[_m].MarketName] = __data[_m][_comp_key];
            }
            else {
                _groups[__data[_m].MarketName.split('-')[0]][__data[_m].MarketName.split('-')[1]] = __data[_m][_comp_key];
            }
        }

        // compare BTC - USDT
        for(var _m in _groups['BTC']){
            if(_groups['USDT'][_m]){
                console.log('comp : ' + _m + ' : ', _groups['USDT'][_m] + '/' + _groups['BTC'][_m]);
            }
        }
        // compare BTC - ETH
        for(var _m in _groups['BTC']){
            if(_groups['ETH'][_m]){
                console.log('comp : ' + _m + ' : ', _groups['ETH'][_m] + '/' + _groups['BTC'][_m]);
            }
        }
        // compare USDT - ETH
        for(var _m in _groups['ETH']){
            if(_groups['USDT'][_m]){
                console.log('comp : ' + _m + ' : ', _groups['USDT'][_m] + '/' + _groups['ETH'][_m]);
            }
        }

        console.log('ccy comp :', _groups);
    });

    $scope.provide('watchMarket', function(_market_name, _fresh) {
        _market_name = _market_name ? _market_name : 'BTC-ETH';
        $scope.WINDOW.market_detail.visible = true;

        // GET ORDER HISTORY
        if (_fresh) {
            $http.get(helper.u('b/getorderhistory?market=' + _market_name)).then(function(_r) {
                console.log('MARKET HISTORY', _r.data);
                if (_r && _r.data && _r.data.result) {
                    if(_r.data.result[0] && _r.data.result[0].OrderType === 'LIMIT_BUY'){
                        $scope._MARKET_DETAIL_HISTORY = _r.data.result[0];
                        var _m =  {
                            unit_price: _r.data.result[0].PricePerUnit,
                            quantity: _r.data.result[0].Quantity,
                            commission: _r.data.result[0].Commission,
                            last: $scope._MARKET_DETAIL.Last
                        };
                        _m.pct = (((_m.last - _m.unit_price) * _m.quantity) - _m.commission) / (_m.unit_price * _m.quantity) * 100;
                        $scope._MARKET_DETAIL_HISTORY._m = _m;
                    }
                }

            });
        }

        // GET MARKET DATA
        $http.get(helper.u('b/getticker?market=' + _market_name)).then(function(_r) {
            console.log('MARKET TICKER', _r.data);
            if (_r && _r.data && _r.data.result) {
                $scope._MARKET_DETAIL = _r.data.result;
            }
            $timeout(function() {
                if ($scope.WINDOW.market_detail.visible) {
                    $scope.watchMarket(_market_name);
                }
            }, 1000);

        });

    });

    $scope.provide('getcryptocurrency', function(_cc) {
        $http.get('http://api.coinmarketcap.com/v1/ticker/' + _cc).then(function(_r) {
            console.log('cc ' + _cc, _r);
        });
    });

    $scope.provide('switchWindow', function(_window, _open) {
        if ($scope.WINDOW && $scope.WINDOW[_window]) {
            if (_open) {
                $scope.WINDOW[_window].visible = true;
                $scope.WINDOW.active_window = _window;
                if ($scope.WINDOW[_window].focus) {
                    UX.focus($scope.WINDOW[_window].focus);
                }
            } else {
                $scope.WINDOW[_window].visible = false;
            }
        } else {
            $scope.WINDOW[_window] = {
                visible: _open
            };
        }
    });

    $scope.provide('activateWindow', function(_window) {
        $scope.WINDOW.active_window = _window;
    });

    $scope.provide('windowDragStop', function(e) {
        var _position = $(e);
        // console.log(_position)
        // console.log('STOP :: (' + _position.left + ', ' + _position.top + ')');
    });

    $scope.provide('testClick', function() {
        alert('test click : success');
    });

    // $scope.provide('keyPressed', function(e, _up) {
    //     $scope.keyCode = e.which;
    //     console.log('key', $scope.keyCode);

    //     if(!_up && $scope.keyCode == 18){
    //         $scope.BTC_mode = false;
    //     }
    //     else if (_up && $scope.keyCode == 18) {
    //         $scope.BTC_mode = true;
    //     }
    // });

    // CONSTRUCTOR
    $scope.provide('init', function() {
        $scope.cursorLoading = false;
        $scope.USDT_BTC = 0;
        // $scope.BTC_mode = true;
        $rootScope.HEADER_TYPE = 'ninja';
        $scope.CURRENT_SITE = {};
        $scope.keyCode = "";

        $scope.WINDOW = {
            // draggable options
            // http://codef0rmer.github.io/angular-dragdrop/#!/
            // https://github.com/codef0rmer/angular-dragdrop
            // http://api.jqueryui.com/draggable/
            // UI
            options: {
                handle: ".dsk-window .head",
                container: ".adminDashboard"
            },
            // NG
            ng_options: {
                container: ".adminDashboard",
                onStop: 'windowDragStop',
            },
            active_window: '',
            'clients_list': {
                visible: false
            },
            'user_list': {
                visible: false
            },
            'market': {
                visible: false,
                focus: '#wallets-input'
            },
            'market_detail': {
                visible: false
            },
            'log': {
                visible: false
            },
            'site_detail': {
                visible: false
            }
        };
        // TMP
        $scope.my_wallets = [{
                market: 'USDT-BTC',
                quantity: 0
            },
            {
                market: 'USDT-ETH',
                quantity: 0
            },
            {
                market: 'BTC-NEO',
                quantity: 42
            },
            {
                market: 'BTC-OMG',
                quantity: 0
            },
            {
                market: 'BTC-OMNI',
                quantity: 0
            }
        ];

        // GET
        // $interval($scope.getmarketsummaries,5000);
        // $scope.getcryptocurrency('neo');
        $scope.getbalances($scope.getmarketsummaries);
    });

    $rootScope.deferredInit($scope.init, true);

}]);
// app.directive('shortcut', function() {
//     return {
//         restrict: 'A',
//         replace: false,
//         scope: true,
//         link: function postLink(scope, iElement, iAttrs) {
//             jQuery(document).on('keydown', function(e) {
//                 scope.$apply(scope.keyPressed(e));

//             });
//             jQuery(document).on('keyup', function(e) {
//                 scope.$apply(scope.keyPressed(e, false));

//             });
//         }
//     };
// });