// init
var hac = {};

function safelyProvide(fn) {
    return (typeof fn === "function") ? function() {
        try {
            return fn.apply(this, arguments);

        } catch (e) {
            console.log("[ERROR] :: ", e);
            // re-throw to halt execution
            throw e;
        }
    } : fn;
}

hac.provide = function(name, fn) {
    this[name] = safelyProvide(fn);
};

// ██╗  ██╗    █████╗     ██████╗   
// ██║  ██║   ██╔══██╗   ██╔════╝   
// ███████║   ███████║   ██║        
// ██╔══██║   ██╔══██║   ██║        
// ██║  ██║██╗██║  ██║██╗╚██████╗██╗
// ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝


hac.provide('watch_user', function(_email) {
    // add flag to user
    // here we should add flag points
    // if this should not happen, BAN user temp or indef..
    // we should also definitively block the route
    sails.log.debug(_email + ' is playing around with restricted apis..');
    BugService.log({
        author: 'uh uh..',
        title: 'HACKER',
        bug: _email + ' is playing around with restricted apis..',
        color: '#F0263E'
    }, sails.log.error);
    return 'Ahahah ! nice try.. we\'ll be watching you ' + _email + '.. ;)';
});

// clean up and exports
delete hac.provide;
module.exports = hac;