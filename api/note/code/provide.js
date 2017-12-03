// ███████╗██████╗ ██████╗  ██████╗ ██████╗       ███╗   ███╗ ██████╗ ███╗   ███╗████████╗
// ██╔════╝██╔══██╗██╔══██╗██╔═══██╗██╔══██╗      ████╗ ████║██╔════╝ ████╗ ████║╚══██╔══╝
// █████╗  ██████╔╝██████╔╝██║   ██║██████╔╝      ██╔████╔██║██║ ████╗██╔████╔██║   ██║   
// ██╔══╝  ██╔══██╗██╔══██╗██║   ██║██╔══██╗      ██║╚██╔╝██║██║   ██║██║╚██╔╝██║   ██║   
// ███████╗██║  ██║██║  ██║╚██████╔╝██║  ██║      ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║   ██║   
// ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝      ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝   ╚═╝   

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
            console.log("[ERROR] :: ", e);
            // re-throw to halt execution
            throw e;
        }
    } : fn;
}


// ██████╗ ██████╗  ██████╗ ██╗   ██╗██╗██████╗ ███████╗
// ██╔══██╗██╔══██╗██╔═══██╗██║   ██║██║██╔══██╗██╔════╝
// ██████╔╝██████╔╝██║   ██║██║   ██║██║██║  ██║█████╗  
// ██╔═══╝ ██╔══██╗██║   ██║██║   ██║██║██║  ██║██╔══╝  
// ██║     ██║  ██║╚██████╔╝ ╚████╔╝ ██║██████╔╝███████╗
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═══╝  ╚═╝╚═════╝ ╚══════╝

// WHEN WE PROVIDE THE DATA
scope.provide = function(name, fn) {
    this[name] = safelyProvide(fn);
};