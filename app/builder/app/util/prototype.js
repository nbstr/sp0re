// ███████╗██████╗ ██████╗  ██████╗ ██████╗       ███╗   ███╗ ██████╗ ███╗   ███╗████████╗
// ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗      ████╗ ████║██╔════╝ ████╗ ████║╚══██╔══╝
// █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝      ██╔████╔██║██║ ████╗██╔████╔██║   ██║   
// ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗      ██║╚██╔╝██║██║   ██║██║╚██╔╝██║   ██║   
// ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║      ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║   ██║   
// ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝   

var errorsToSlack = false;
var ManagedError = function(message) {
    Error.prototype.constructor.apply(this, arguments);
    this.message = message;
};

ManagedError.prototype = new Error();

// CREATE NEW ERRORS THAT ARE MANAGED AND NEED NO DEBUGGING
// throw new ManagedError("Invalid argument");

function safelyProvide(fn) {
    return (typeof fn === "function") ? function() {
        try {
            return fn.apply(this, arguments);

        } catch (e) {
            if (e instanceof ManagedError) {
                // re-throw immediately
                throw e;
            }
            // console.log("[ERROR] :: ", e);

            if (errorsToSlack) {
                var img_load = JSON.stringify({
                    error: "LOAD",
                    extra: {
                        name: e.name,
                        line: (e.lineNumber || e.line),
                        script: (e.fileName || e.sourceURL || e.script),
                        stack: (e.stackTrace || e.stack),
                        revision: "0000001",
                        namespace: "HEY",
                        message: e.message
                    }
                });
                new Image().src = "http://hey-hey.co/api/v1/bug?c=WIDGET.ERROR&m=" + encodeURIComponent(img_load);
                console.log('%cHey ! %c An error occured, but don\'t worry, we are aware of it and will be working on it asap. %c♥︎', 'font-weight:bold;color:#000;', 'color:#777;', 'color:#F92672;');
                console.log('%cFeel free to contact us : hey@hey-hey.co', 'color:#777;');
            }

            // re-throw to halt execution
            throw e;
        }
    } : fn;
}

// ██████╗ ██████╗  ██████╗ ████████╗ ██████╗ ████████╗██╗   ██╗██████╗ ███████╗
// ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝██╔═══██╗╚══██╔══╝ ██╗ ██╔╝██╔══██╗██╔════╝
// ██████╔╝██████╔╝██║   ██║   ██║   ██║   ██║   ██║     ████╔╝ ██████╔╝█████╗  
// ██╔═══╝ ██╔══██╗██║   ██║   ██║   ██║   ██║   ██║      ██╔╝  ██╔═══╝ ██╔══╝  
// ██║     ██║  ██║╚██████╔╝   ██║   ╚██████╔╝   ██║      ██║   ██║     ███████╗
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝    ╚═╝      ╚═╝   ╚═╝     ╚══════╝
// — ECMA262-5

if (!('bind' in Function.prototype)) {
    Function.prototype.bind = function(owner) {
        var that = this;
        if (arguments.length <= 1) {
            return function() {
                return that.apply(owner, arguments);
            };
        } else {
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                return that.apply(owner, arguments.length === 0 ? args : args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
}
if (!('trim' in String.prototype)) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
}

Array.prototype.provide = function(name, fn) {
    if (!(name in this)) {
        this[name] = safelyProvide(fn);
    }
};

Array.prototype.provide('indexOf', function(find, i /*opt*/ ) {
    if (i === undefined) i = 0;
    if (i < 0) i += this.length;
    if (i < 0) i = 0;
    for (var n = this.length; i < n; i++)
        if (i in this && this[i] === find)
            return i;
    return -1;
});

Array.prototype.provide('lastIndexOf', function(find, i /*opt*/ ) {
    if (i === undefined) i = this.length - 1;
    if (i < 0) i += this.length;
    if (i > this.length - 1) i = this.length - 1;
    for (i++; i-- > 0;) /* i++ because from-argument is sadly inclusive */
        if (i in this && this[i] === find)
            return i;
    return -1;
});

Array.prototype.provide('forEach', function(action, that /*opt*/ ) {
    for (var i = 0, n = this.length; i < n; i++)
        if (i in this)
            action.call(that, this[i], i, this);
});

Array.prototype.provide('map', function(mapper, that /*opt*/ ) {
    var other = new Array(this.length);
    for (var i = 0, n = this.length; i < n; i++)
        if (i in this)
            other[i] = mapper.call(that, this[i], i, this);
    return other;
});

Array.prototype.provide('filter', function(filter, that /*opt*/ ) {
    var other = [],
        v;
    for (var i = 0, n = this.length; i < n; i++)
        if (i in this && filter.call(that, v = this[i], i, this))
            other.push(v);
    return other;
});

Array.prototype.provide('every', function(tester, that /*opt*/ ) {
    for (var i = 0, n = this.length; i < n; i++)
        if (i in this && !tester.call(that, this[i], i, this))
            return false;
    return true;
});

Array.prototype.provide('some', function(tester, that /*opt*/ ) {
    for (var i = 0, n = this.length; i < n; i++)
        if (i in this && tester.call(that, this[i], i, this))
            return true;
    return false;
});

delete Array.prototype.provide;