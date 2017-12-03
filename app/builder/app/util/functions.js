// ██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ 
// ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗
// ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝
// ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗
// ██║  ██║███████╗███████╗██║     ███████╗██║  ██║
// ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝

//Add utility functions
(function() {
    //retrieve the root object
    var _this = this;
    //Actual helper functions
    var helper = {
        provide: function(name, fn) {
            this[name] = safelyProvide(fn);
        }
    };

    helper.provide('getFavicon', function(domain_name) {
        return "http://www.google.com/s2/favicons?domain=" + encodeURIComponent(domain_name);
        // return "http://www.google.com/s2/favicons?domain=" + encodeURIComponent(domain_name).replace(/'/g,"%27").replace(/"/g,"%22");
    });

    helper.provide('getSiteTitle', function(domain_name) {
        return "http://textance.herokuapp.com/title/" + encodeURIComponent(domain_name);
    });

    helper.provide('testMobile', function() {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
            isMobile = true;
        return isMobile;
    });

    helper.provide('defaultError', function() {
        if (!config.app.silent_error) {
            console.log('error : ', arguments);
        }
    });

    helper.provide('splitHostname', function(_hostname) {
        _hostname = _hostname ? _hostname : window.location.hostname;
        // ADDING PARAMETERS: top level domain, domain, sub domain.
        var splitHostname = _hostname.split('.');
        return {
            tld: splitHostname[splitHostname.length - 1],
            d: splitHostname[splitHostname.length - 2],
            sd: splitHostname.length > 2 ? splitHostname[splitHostname.length - 3] : null,
            ssd: splitHostname.length > 3 ? splitHostname[splitHostname.length - 4] : null
        };
    });

    helper.provide('moveInArray', function(_array, old_index, new_index) {
        if (new_index >= _array.length) {
            var k = new_index - _array.length;
            while ((k--) + 1) {
                _array.push(undefined);
            }
        }
        _array.splice(new_index, 0, _array.splice(old_index, 1)[0]);
        return _array;
    });

    helper.provide('blurb', function(_txt, _limit) {
        _limit = _limit ? _limit : 30;
        return (_txt.length > _limit) ? (_txt.substring(0, _limit) + '…') : (_txt);
    });

    helper.provide('alt', function(_value, _alternative, _cnd) {
        _cnd = _cnd ? _cnd : 'normal';
        if (_cnd === 'exists') {
            return (_value !== undefined && _value !== null) ? _value : _alternative;
        } else if (_cnd === 'isNumber') {
            return (typeof _value === typeof 1989) ? _value : _alternative;
        }
        // ADD ANY OTHER CONDITION
        else {
            return _value ? _value : _alternative;
        }
    });

    helper.provide('debounce', function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    });

    helper.provide('u', function(url) {
        return config.app[config.app.production ? 'apiProdUrl' : 'apiUrl'] + url;
    });

    helper.provide('replaceAll', function(find, replace, str) {
        return str.replace(new RegExp(find, 'g'), replace);
    });

    helper.provide('replaceNoRegex', function(find, replace, str) {
        if (!str) {
            return '';
        }
        return str.split(find).join(replace);
    });

    helper.provide('clone', function(obj) {
        return JSON.parse(JSON.stringify(obj));
    });

    helper.provide('inArray', function(_key, _array) {
        if (_key && _array && typeof _array === typeof ['array']) {
            return _array.indexOf(_key) > -1;
        } else {
            return false;
        }

    });

    // GET LOCATION
    // ------------
    // Returns top window.location object to be sent to iframe app
    helper.provide('getLocation', function() {
        var _location = window.location;

        // CLEAR PARAMS
        var page_url = _location.href;
        var index = Math.min(page_url.indexOf('?'), page_url.indexOf('#'));
        if (index > -1) {
            page_url = page_url.substring(0, index);
        }

        var __location = {
            hash: _location.hash,
            host: _location.host,
            hostname: _location.hostname,
            href: (_location.origin + _location.pathname).replace(/\/$/, ""),
            // href: page_url,
            origin: _location.origin,
            pathname: _location.pathname,
            port: _location.port,
            protocol: _location.protocol,
            search: _location.search
        };

        // console.log('location : ', __location);

        return __location;
    });

    helper.provide('scrollTo', function(selector, callback) {
        var _element, _offset;
        if (selector) {
            _element = $(selector);
            if (_element.length == 0) {
                _offset = 0;
            } else {
                _offset = element.offset().top;
            }
        } else {
            _offset = 0;
        }
        $('html, body').animate({
            scrollTop: _offset
        }, 400, function(e) {
            if (callback && typeof(callback) == "function") {
                callback();
            }
        });

    });

    helper.provide('navigator', function() {
        // Opera 8.0+
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            return 'opera';
        }
        // Firefox 1.0+
        else if (typeof InstallTrigger !== 'undefined') {
            return 'firefox';
        }
        // Safari 3.0+ "[object HTMLElementConstructor]" 
        else if (/constructor/i.test(window.HTMLElement) || (function(p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window['safari'] || safari.pushNotification)) {
            return 'safari';
        }
        // Internet Explorer 6-11
        else if ( /*@cc_on!@*/ false || !!document.documentMode) {
            return 'ie';
        }
        // Edge 20+
        else if (!isIE && !!window.StyleMedia) {
            return 'edge';
        }
        // Chrome 1+
        else if (!!window.chrome && !!window.chrome.webstore) {
            return 'chrome';
        }
        // Blink engine detection
        else if ((isChrome || isOpera) && !!window.CSS) {
            return 'blink';
        }
        // none detected
        else {
            return 'none';
        }
    });

    helper.provide('is', function(key, obj) {
        if (key == 'function') {
            return {}.toString.apply(obj) === '[object Function]';
        } else if (key == 'array') {
            return {}.toString.apply(obj) === '[object Array]';
        } else if (key == 'object') {
            return {}.toString.apply(obj) === '[object Object]';
        } else {
            return false;
        }
    });

    helper.provide('prefix', function(input) {
        if (typeof input === 'string') {
            return (config.app.app_prefix + input);
        } else {
            return input;
        }
    });

    helper.provide('localstorage_prefix', function(input) {
        if (typeof input === 'string') {
            input = (config.app.localstorage_keys[input]) ? config.app.localstorage_keys[input] : input;
            return helper.prefix(input);
        } else {
            return input;
        }
    });

    helper.provide('mauticInjectCss', function(css, name) {
        var doc = frames[name].document,
            head = doc.head || doc.getElementsByTagName('head')[0],
            style = doc.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(doc.createTextNode(css));
        }

        head.appendChild(style);
    });

    helper.provide('log', function(content, production) {
        if (production || (config && config.app && config.app.production)) {
            console.log(content);
        }
    });

    // WATCH SCREEN
    // ------------
    // Watch the visual focus on the window for optimisation. This way, we can :
    // • check user auth after a very long comeback.
    // • disable api calls and watchers while the user isn't active
    helper.provide('watchScreen', function(_cb) {
        // call this function with a callback function that will have a BOOLEAN as
        // parameter which will tell wether the user focus is on or off
        // • on : user came back on window
        // • false : user hid the window
        var hidden = "hidden",
            _topWindow = window;

        // Standards:
        if (hidden in _topWindow.document) {
            _topWindow.document.addEventListener("visibilitychange", onchange);
        } else if ((hidden = "mozHidden") in _topWindow.document) {
            _topWindow.document.addEventListener("mozvisibilitychange", onchange);
        } else if ((hidden = "webkitHidden") in _topWindow.document) {
            _topWindow.document.addEventListener("webkitvisibilitychange", onchange);
        } else if ((hidden = "msHidden") in _topWindow.document) {
            _topWindow.document.addEventListener("msvisibilitychange", onchange);
        }
        // IE 9 and lower:
        else if ("onfocusin" in _topWindow.document) {
            _topWindow.document.onfocusin = _topWindow.document.onfocusout = onchange;
        }
        // All others:
        else {
            _topWindow.onpageshow = _topWindow.onpagehide = _topWindow.onfocus = _topWindow.onblur = onchange;
        }

        function onchange(evt) {
            var v = "visible",
                h = "hidden",
                evtMap = {
                    focus: v,
                    focusin: v,
                    pageshow: v,
                    blur: h,
                    focusout: h,
                    pagehide: h
                };

            evt = evt || _topWindow.event;
            if (evt.type in evtMap) {} else {
                if (typeof _cb === 'function') {
                    _cb(!this[hidden]);
                }
            }
        }

        // set the initial state (but only if browser supports the Page Visibility API)
        if (_topWindow.document[hidden] !== undefined) {
            onchange({ type: _topWindow.document[hidden] ? "blur" : "focus" });
        }
    });
    //attached the helper to the root object
    _this.helper = helper;

}).call(this);

// function __log(_txt) {
//     console.log('%c' + _txt, 'color: #657786; font-weight: 100; font-size: 10px;');
// }

// function startGame() {
//     __log('.. ok pretty impressive. To get to next step, you must find the secret in this page.');
//     console.log('%c' + 'it is so close ...', 'color: #B3C3C8; font-weight: 100; font-size: 10px;');
//     console.log('%c' + 'the secret password is : superPanda() ! Great job ! Yep it\'s another function..', 'color: #FFFFFF; font-weight: 100; font-size: 10px;');
// };

// function superPanda() {
//     __log('cool cool cool. Send us an email to nab@hey-hey.co and tell us super panda sent you ;) keep that a secret.');
// };
// console.log('%cHey ♥︎', 'font-family:"Arial Black";font-weight:bold;font-size:60px;color:#fff;text-shadow:0 1px 0#ccc,0 2px 0  #c9c9c9 ,0 3px 0  #bbb ,0 4px 0  #b9b9b9 ,0 5px 0  #aaa ,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);');
// __log('\noh.. you are here.. well .. hello !\nif you are looking for a job, you can call the startGame() function. ;)');