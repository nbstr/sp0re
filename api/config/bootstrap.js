/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

//TODO handle subfolder in services, api,...

var TAG = "[Bootstrap]";
var fs = require("fs");
var http = require('http');

module.exports.bootstrap = function(cb) {

    sails.hooks.http.app.set('trust proxy', true);

    //Settings synonyms for some services
    global.db = DB; //require("../api/services/DB.js");
    global.Db = DB; //require("../api/services/DB.js");
    //global.Log = L;//require("../api/services/L.js");
    //global.log = L;//require("../api/services/L.js");

    //Load params from config file in config/env/config_(dev|prod).json
    var configFile = process.env.NODE_ENV === "production" ? "prod.json" : "dev.json";
    sails.config.params = JSON.parse(fs.readFileSync('./config/env/config_' + configFile, 'utf8'));
    if (typeof(sails.config.params.bug_report_email) === "string") {
        sails.config.params.bug_report_email = [sails.config.params.bug_report_email];
    }

    async.waterfall([

        function(cb) {
            if (sails.config.environment === "production") {
                http.createServer(sails.hooks.http.app).listen(59088);
            }
            return cb();
        },

        //Create location index
        function(cb) {
            Location.native(function(err, collection) {
                if (!err) {
                    collection.createIndex({ type: 1, "position": "2dsphere" }, function(err) {
                        if (err) L.err(TAG, "Error while creating 2dsphere index :", err);
                        return cb(err);
                    });
                } else {
                    L.err(TAG, "Error while doing a native query for the index :", err);
                    return cb(err);
                }
            });

            User.native(function(err, collection) {
                if (!err) {
                    collection.createIndex({ "facebook_id": 1 }, function(err) {
                        if (err) L.err(TAG, "Error while creating facebook_id index :", err);
                        return cb(err);
                    });
                } else {
                    L.err(TAG, "Error while doing a native query for the index :", err);
                    return cb(err);
                }
            });

        },

        //add deleted field to all models
        function(cb) {
            _.each(sails.models, function(model) {
                //TODO check if  following doesn't break everything
                model._attributes.deleted = { type: "BOOL", noUpdate: true };
                //model.definition = {type: "BOOL", noUpdate: true};
                model._schema.schema.deleted = { type: "BOOL", noUpdate: true };
            });
            return cb();
        }

    ], cb);

};
