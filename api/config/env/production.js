/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the production        *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/
    server_url: "http://localhost:59089/",
    // ssl: {
    //     ca: require('fs').readFileSync(__dirname + '/ssl/server.crt'),
    //     key: require('fs').readFileSync(__dirname + '/ssl/server.key'),
    //     cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
    // },
    port: process.env.PORT || 59089,
    policies: {
        '*': 'isHTTPS'
    }

    //TODO change server_url

    // models: {
    //   connection: 'someMysqlServer'
    // },

    /***************************************************************************
     * Set the port in the production environment to 80                        *
     ***************************************************************************/

    // port: 80,

    /***************************************************************************
     * Set the log level in production environment to "silent"                 *
     ***************************************************************************/

    // log: {
    //   level: "silent"
    // }

};
