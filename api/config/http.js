/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP request. (the Sails *
         * router is invoked by the "router" middleware below.)                     *
         *                                                                          *
         ***************************************************************************/

        order: [
            'startRequestTimer',
            'cookieParser',
            'session',
            'logger',
            'bodyParser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500',
            'disablePoweredBy',
        ],

        disablePoweredBy: function(request, response, next) {
            var expressApp = sails.hooks.http.app;
            expressApp.disable('x-powered-by');
            // response.set('X-Powered-By', 'Hey');
            next();
        },

        logger: function(req, res, next) {
            res.on("finish", function() {
                // sails.log("[ROUTE]", res.statusCode.toString(), "::", req.method, req.url, (req.session && req.session.user ? "(user_id: " + req.session.user.id + ")" : ''), (res.errors ? JSON.stringify(res.errors) : ''));
            });
            return next();
        }


        /***************************************************************************
         *                                                                          *
         * The body parser that will handle incoming multipart HTTP requests. By    *
         * default as of v0.10, Sails uses                                          *
         * [skipper](http://github.com/balderdashy/skipper). See                    *
         * http://www.senchalabs.org/connect/multipart.html for other options.      *
         *                                                                          *
         ***************************************************************************/

        // bodyParser: require('skipper')
    },

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    // cache: 31557600000
};
