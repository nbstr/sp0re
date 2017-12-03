
// The order of precedence for log levels from lowest to highest is:
// silly, verbose, info, debug, warn, error

var winston = require('winston');
var name = JSON.parse(require('fs').readFileSync('./package.json')).name.toLowerCase();

var dateFormatted = function(){
    var d = new Date();
    var timezone = d.getTimezoneOffset()/-60;
    if (timezone > 0) timezone = "+" + timezone;
    d = d.getFullYear() + "-" + ("0" + (d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2) + " " + timezone;
    return d;
};

var parseOptions = function(options){
    options.level += " ";
    options.level = options.level.substr(0, 5).toUpperCase();
    options.message = options.message || '';
    options.meta = options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '';
};

var formatter = function(options) {
    parseOptions(options);
    return dateFormatted() + ' :: ' + options.level + ' :: ' + options.message  + options.meta;
};

var formatterWarn = function(options) {
    if (options.level == "warn") {    
        parseOptions(options);
        return dateFormatted() + ' :: ' + options.level + ' :: ' + options.message + options.meta;
    }
    else return "";
};

var customLogger = new winston.Logger({
    transports: [
        new(winston.transports.Console)({
            level: "silly",
            formatter: formatter,
            colors: true,
        }),
        new(require('winston-daily-rotate-file'))({
            level: 'debug', //if it's set to 'info', it does not print for debug level, but here it printit + info, error and warn
            formatter: formatter,
            filename: './logs/' + name + '_debug',
            //datePattern: "yyyy-MM-dd", //by default
            json: false,
            colors: false, 
            name: "debug-file"
        }),
        new(require('winston-daily-rotate-file'))({
            level: 'error',
            formatter: formatter,
            filename: './logs/' + name + '_error',
            json: false,
            colors: false,
            name: "error-file"
        }),
        new(require('winston-daily-rotate-file'))({
            level: 'warn',
            formatter: formatterWarn,
            filename: './logs/' + name + '_warn',
            json: false,
            colors: false,
            name: "warn-file"
        }),
    ],
});

/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

module.exports.log = {

    /***************************************************************************
     *                                                                          *
     * Valid `level` configs: i.e. the minimum log level to capture with        *
     * sails.log.*()                                                            *
     *                                                                          *
     * The order of precedence for log levels from lowest to highest is:        *
     * silly, verbose, info, debug, warn, error                                 *
     *                                                                          *
     * You may also set the level to "silent" to suppress all logs.             *
     *                                                                          *
     ***************************************************************************/
    level: "info",
    colors: false, // To get clean logs without prefixes or color codings
    custom: customLogger,
    noShip: true

};