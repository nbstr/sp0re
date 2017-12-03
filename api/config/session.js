/**
 * Session Configuration
 * (sails.config.session)
 *
 * Sails session integration leans heavily on the great work already done by
 * Express, but also unifies Socket.io with the Connect session store. It uses
 * Connect's cookie parser to normalize configuration differences between Express
 * and Socket.io and hooks into Sails' middleware interpreter to allow you to access
 * and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.session.html
 */

var name = JSON.parse(require('fs').readFileSync('./package.json')).name.toLowerCase();

var CONNECTION_URIS = {
    dev: "mongodb://localhost:21989/hey-backend",
    prod: "mongodb://heyadmin:ec]gI2[4jdif9cod#3fUnIb>=qj8tith@127.0.0.1:21989/hey-backend?authSource=test",
    atlas: "mongodb://heyadmin:ec]gI2[4jdif9cod#3fUnIb>=qj8tith@127.0.0.1:21989/hey-backend?authSource=test"
};

module.exports.session = {

    /***************************************************************************
     *                                                                          *
     * Session secret is automatically generated when your new app is created   *
     * Replace at your own risk in production-- you will invalidate the cookies *
     * of your users, forcing them to log in again.                             *
     *                                                                          *
     ***************************************************************************/

    secret: 'dizeofnzoienfoizenfozeifdzzoiec',
    key: 'hey-anything-for-truth',
    // secure: false,

    // saveUninitialized: false,

    url: CONNECTION_URIS[(process.env.NODE_ENV === "production" ? "prod" : "dev")],
    // host: 'localhost',
    // port: 21989,
    // db: 'hey-backend',

    adapter: 'mongo',
    collection: 'sessions',

    // auto_reconnect: false,
    // ssl: false,
    // stringify: true,

    // Max age is one semester
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    // Clear the session every hour
    clear_interval: 3600,

    /***************************************************************************
     *                                                                          *
     * Set the session cookie expire time The maxAge is set by milliseconds,    *
     * the example below is for 24 hours                                        *
     *                                                                          *
     ***************************************************************************/

    // cookie: {
    //   maxAge: 24 * 60 * 60 * 1000
    // },

    /***************************************************************************
     *                                                                          *
     * In production, uncomment the following lines to set up a shared redis    *
     * session store that can be shared across multiple Sails.js servers        *
     ***************************************************************************/

    // adapter: 'sails-redis',
    // url: 'redis://127.0.0.1:22989',

    /***************************************************************************
     *                                                                          *
     * The following values are optional, if no options are set a redis         *
     * instance running on localhost is expected. Read more about options at:   *
     * https://github.com/visionmedia/connect-redis                             *
     *                                                                          *
     *                                                                          *
     ***************************************************************************/

    // host: 'localhost',
    // port: 6379,
    // ttl: <redis session TTL in seconds>,
    // db: 0,
    // pass: <redis auth password>,
    // prefix: 'sess:',


    /***************************************************************************
     *                                                                          *
     * Uncomment the following lines to use your Mongo adapter as a session     *
     * store                                                                    *
     *                                                                          *
     ***************************************************************************/

    // adapter: 'mongo',
    // host: 'localhost',
    // port: 27017,
    // db: 'sails',
    // collection: 'sessions',

    /***************************************************************************
     *                                                                          *
     * Optional Values:                                                         *
     *                                                                          *
     * # Note: url will override other connection settings url:                 *
     * 'mongodb://user:pass@host:port/database/collection',                     *
     *                                                                          *
     ***************************************************************************/

    // username: '',
    // password: '',
    // auto_reconnect: false,
    // ssl: false,
    // stringify: true

};
