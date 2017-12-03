var bcrypt = require('bcrypt');
var randomstring = require('randomstring');
var objectid = require('objectid');
var request = require('request');

var formatSettings = function(user, oldSettings) {
    var settings = user.settings;
    oldSettings = oldSettings || {};

    if (!settings) {
        settings = oldSettings;
    }
    if (!settings.language) {
        settings.language = oldSettings.language || "en";
    }

    user.settings = {
        language: settings.language
    };

    if (settings.developer !== null && settings.developer !== undefined) {
        user.settings.developer = settings.developer;
    } else if (oldSettings.developer !== null && oldSettings.developer !== undefined) {
        user.settings.developer = oldSettings.developer;
    } else {
        user.settings.developer = false;
    }
};

module.exports = {

    create: function(data) {
        var user = data.user,
            req = data.req,
            cb = data.callback;

        formatSettings(user);

        if (!user.facebook_id && !user.google_id) {
            //password_repeat is not in the model so we need to add it in user (the user model checks the passwords)
            user.password_repeat = req.allParams().password_repeat;
            user.new_password = user.password;
        }

        // [] REGISTERY
        user.points = sails.config.points.attrs.notifications.custom['user.register'];

        if (sails.config.params.send_confirmation_mail === true && !user.facebook_id && !user.google_id) {
            user.registrationToken = randomstring.generate(32);
        } else {
            user.activated = true;
        }

        DB.create(User, user, { keep: ["registrationToken"], populate: "address" }, function(err, user) {
            if (err) return cb(err);

            if (user.registrationToken) {
                EmailService.emailConfirmation(user);
            }

            // SLACK
            BugService.log({
                icon: user.picture,
                author: user.first_name + ' ' + user.last_name,
                title: 'a new user just joined ! ',
                content: user.email + ' (' + user.id + ')',
                channel: 'new_user',
                productionOnly: true
            }, sails.log.error);

            delete user.registrationToken;
            // CREATE WELCOME NOTIFICATION
            UserNotificationService.create({
                user: user.id,
                type: 'user.register',
                content: '',
                data: {
                    user: {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        picture: user.picture,
                        points: sails.config.points.attrs.notifications.custom['user.register']
                    }
                }
            });

            return cb(null, user);
        });
    },

    resendConfirmation: function(data) {
        var email = data.req.body.email,
            req = data.req,
            cb = data.callback;

        DB.findOne(User, { email: email }, { keep: ["registrationToken"] }, function(err, user) {
            if (err) return cb(err);
            if (!user) {
                UserService.disconnect(req);
                return cb("authentication");
            } else {
                console.log('user', user);
                EmailService.emailConfirmation(user);
                return cb(null, user);
            }
        });
    },

    update: function(data) {

        var user = data.user,
            req = data.req,
            callback = data.callback,
            log_user = req.session.user;

        //user cannot udpdate his password through this API
        delete user.password_repeat;
        delete user.password;

        async.waterfall([

            function(cb) {
                DB.get(User, log_user.id, cb);
            },

            function(luser, cb) {
                log_user = luser;
                formatSettings(user, log_user.settings);

                //Verify the email address if it's a new one
                //If it is, set a new registrationtoken and send the email confirmation
                if (user.email && log_user.email != user.email && sails.config.params.send_confirmation_mail === true) {
                    db.findOne(User, { email: user.email, new_email: user.email }, { deleted: true, or: true }, function(err, otherUser) {
                        if (err) return cb(err);
                        if (otherUser && otherUser.id != log_user.id) return cb("email_exists");
                        user.new_email = user.email;
                        delete user.email;
                        user.registrationToken = randomstring.generate(32);
                        return cb();
                    });
                } else cb();
            },

            function(cb) {
                DB.updateOne(User, log_user, user, { populate: "address" }, function(err, upd_user) {
                    if (err) return cb(err);

                    if (!user.google_id && !user.facebook_id) {
                        UserService.connect(upd_user, req);
                    }

                    if (user.new_email) {
                        EmailService.newEmailConfirmation({ email: user.new_email, registrationToken: user.registrationToken, first_name: upd_user.first_name, last_name: upd_user.last_name });
                    }

                    return cb(null, upd_user);
                });
            }


        ], callback);
    },

    softDelete: function(data) {
        var user = data.req.session.user;

        DB.delete(User, user.id, data.callback);
    },

    addPoints: function(params, cb) {
        /**
         * Add points to user
         *
         * @param {String} user
         * @param {Integer} points
         *
         */

        var _data = {
            user: params.user,
            points: params.points
        };

        if (!(typeof cb === 'function')) {
            cb = function(error, data) {
                if (error) {
                    sails.log.error(error);
                }
            }
        }

        User.native(function(err, collection) {
            if (!err) {
                collection.update({ _id: objectid(_data.user) }, { $inc: { points: parseInt(_data.points) } }, function(err, results) {
                    if (err) return cb(err);
                    return cb(null, 'points added.');
                });

            } else {
                L.err(TAG, "Error while doing a native query for $inc :", err);
                return cb(err);
            }
        });
    },

    changePassword: function(data) {

        var req = data.req,
            callback = data.callback,
            params = data.params,
            password = params.password,
            password_repeat = params.password_repeat,
            old_password = params.old_password,
            user_id = req.session.user.id;

        //if (!password) return callback({type:"required", info:"password"});
        //if (!password_repeat) return callback({type:"required", info:"password_repeat"});
        //if (!old_password) return callback({type:"required", info:"old_password"});

        async.waterfall([

            function(cb) {
                DB.findOne(User, { id: user_id }, { populate: "address", keep: "password" }, function(err, user) {
                    if (err) return cb(err);
                    if (!user) {
                        UserService.disconnect(req);
                        return cb("authentication");
                    } else {
                        return cb(null, user);
                    }
                });
            },

            function(user, cb) {
                bcrypt.compare(old_password, user.password, function(err, res) {
                    if (err) return cb(err);
                    if (!res) return cb("old_password_error");

                    DB.updateOne(User, user_id, { new_password: password, password_repeat: password_repeat }, cb);
                });
            }

        ], callback);
    },

    resetPassword: function(data) {
        var req = data.req,
            cb = data.callback,
            email = data.params.email;

        DB.findOne(User, { email: email }, function(err, user) {

            if (!user) return cb();

            var newPass = randomstring.generate(10);

            EmailService.resetPassword({
                email: email,
                password: newPass,
                callback: function(err) {
                    if (err) return cb(err);
                    DB.updateOne(User, user, { new_password: newPass, password_repeat: newPass }, function(error, data) {
                        sails.log('ERROR', error);
                        sails.log('DATA', data);
                        cb(error, data);
                    });
                }
            });

        });
    },

    validateEmail: function(data) {
        var registrationToken = data.params.registrationToken;

        DB.findOne(User, { registrationToken: registrationToken }, { keep: "activated" }, function(err, user) {
            //TODO page 404
            if (err || !user) {
                return data.res.view('emailTemplates/emailWebCallbackDone/html');
            }
            if (user.activated) {
                DB.updateOne(User, user, { registrationToken: null, email: user.new_email, new_email: null }, function(err, user) {
                    return data.res.view('emailTemplates/emailWebCallbackDone/html');
                });
            } else {
                DB.updateOne(User, user, { registrationToken: null, activated: true }, function(err, user) {
                    return data.res.view('emailTemplates/emailWebCallback/html', {
                        name: user.first_name + ' ' + user.last_name
                    });
                });
            }
        });

    },

    checkEmail: function(data) {
        DB.findOne(User, {
            email: data.req.param('email')
        }, function(error, user) {
            if (error ||  !user) {
                data.res.json({
                    error: false,
                    nfo: "email available",
                    data: data.req.param('email')
                });
            } else {
                data.res.json({
                    error: true,
                    nfo: "email unavailable",
                    data: data.req.param('email')
                });
            }
        });
    },

    me: function(data) {
        DB.get(User, data.req.session.user.id, { populate: 'address' }, data.callback);
    },

    connect: function(user, req) {
        console.log('  connecting ' + user.email);
        req.session.user = {};
        req.session.user.id = user.id;
        req.session.user.type = user.type;
        req.session.user.email = user.email;
        req.session.user.first_name = user.first_name;
        req.session.user.last_name = user.last_name;
        req.session.user.picture = user.picture;
        if (user.facebook_id) {
            req.session.user.facebook_id = user.facebook_id;
        }
        if (user.access_token) {
            req.session.user.access_token = user.access_token;
        }
        console.log('  session : ', req.session.user.id);
    },

    disconnect: function(req) {
        delete req.session.user;
    },

    uploadUserPicture: function(data) {

        var req = data.req,
            cb = data.callback;

        if (!req.session.user ||  !req.session.user.id) {
            return cb('must be connected do upload picture');
        } else {
            ImageService.uploadServer(req, "u_" + req.session.user.id, function(err, filepath) {

                if (err) return cb(err);

                var user_id = req.session.user ? req.session.user.id : "-1";

                if (user_id === "-1") {
                    req.session.profile_picture = { default: filepath };
                    return cb(null, req.session.profile_picture);
                } else {
                    DB.get(User, user_id, function(err, user) {

                        //The user is not yet registered, save his picture in session before he register
                        if (!user) {
                            req.session.profile_picture = { default: filepath };
                            return cb(null, req.session.profile_picture);
                        }

                        //update the user with new paths for the pictures
                        else {
                            DB.updateOne(User, user_id, {
                                pictures: { default: filepath },
                                picture: filepath,
                            }, cb);
                        }
                    });
                }

            });
        }

    },

    getPicture: function(data) {

        var req = data.req,
            cb = data.callback;

        if (!req.param('user_id')) {
            return cb('must give a user id');
        } else {
            DB.findOne(User, req.param('user_id'), function(err, user) {

                console.log('user photo : ', user.picture);

                if (err) return cb(err);
                if (!user) {
                    return cb('no user');
                } else {
                    return cb(null, user.picture);
                }
            });
        }

    },

    getSitesManaged: function(data, cb) {

        DB.find(UserRole, {
            user: data.user.id
        }, function(err, roles) {

            if (err) return cb(err);
            if (!roles) {
                return cb(null, []);
            } else {
                return cb(null, roles);
            }

        });

    },

    userRole: function(data, cb) {

        DB.findOne(UserRole, data.id, {
            populate: 'site'
        }, function(err, role) {

            if (err) return cb(err);
            if (!role) {
                return cb(null, {});
            } else {
                return cb(null, role);
            }

        });

    },

    handshake: function(data, cb) {

        DB.get(User, data.req.session.user.id, { populate: 'address' }, function() {
            DB.get(Site, {
                hostname: data.domain
            }, cb);
        });

    },

    updateUserRole: function(data, cb) {

        DB.updateOne(UserRole, data.id, data, function(err, role) {

            if (err) return cb(err);
            if (!role) {
                return cb(null, {});
            } else {
                return cb(null, role);
            }

        });

    },

    manageSite: function(data, cb) {

        var _key = randomstring.generate(32);

        var splitHostname = data.domain.split('.');
        var _domain_split = {
            tld: splitHostname[splitHostname.length - 1],
            d: splitHostname[splitHostname.length - 2],
            sd: splitHostname.length > 2 ? splitHostname[splitHostname.length - 3] : null,
            ssd: splitHostname.length > 3 ? splitHostname[splitHostname.length - 4] : null
        };

        var callback = function(_site, _user_role) {

            cb(null, {
                key: _key,
                site: _site,
                user_role: _user_role
            });
        };

        var findOrCreateUserRole = function(_site) {

            DB.findOne(UserRole, {
                user: data.user.id,
                site: _site.id,
                role: 'superadmin'
            }, function(err, user_role) {
                if (err) {
                    cb(err)
                } else if (!user_role) {
                    //create
                    DB.create(UserRole, {
                        user: data.user.id,
                        site: _site.id,
                        sitename: _site.hostname,
                        key: _key,
                        role: 'superadmin'
                    }, function(err, new_user_role) {
                        if (err || !new_user_role) {
                            cb(err ? err : 'not_allowed', new_user_role);
                        } else {
                            callback(_site, new_user_role);
                        }
                    });
                } else {
                    // get it
                    callback(_site, user_role);
                }

            });
        };

        var findOrCreateSite = function() {
            DB.findOne(Site, {
                hostname: data.domain
            }, function(err, site) {
                if (err) { cb(err) } else if (!site) {
                    //create
                    DB.create(Site, {
                        tld: _domain_split.tld,
                        d: _domain_split.d,
                        sd: _domain_split.sd,
                        ssd: _domain_split.ssd,
                        hostname: data.domain
                    }, function(err, new_site) {
                        if (err || !new_site) {
                            cb(err ? err : 'not_allowed', new_site);
                        } else {
                            findOrCreateUserRole(new_site)
                        }
                    });
                } else {
                    // get it
                    findOrCreateUserRole(site);
                }

            });
        };

        findOrCreateSite();

    },

    verifySite: function(data, cb) {

        DB.findOne(UserRole, {
            id: data.id
        }, function(err, role) {

            if (err || !role || (role && role.active)) return cb(err);
            else {
                sails.log.debug('user role found');

                // check website
                request.get({ url: 'http://' + role.sitename }, function(error, response, body) {
                    if (error) {
                        sails.log.error('error : ', error);
                        cb('not_allowed');
                    } else {

                        var _regex = new RegExp('<\\s*script\\s*src="\/\/widget.hey-hey.co\/init.js"\\s*data-key="(' + role.key + ')"\\s*><\/\\s*script\\s*>', 'ig');

                        var matches = [];
                        while (_regex.exec(body)) {
                            matches.push(RegExp.$1);
                        }

                        //contains all cookie values
                        sails.log.debug(matches);
                        if (matches.length > 0) {
                            //FOUND
                            DB.updateOne(UserRole, {
                                id: data.id
                            }, {
                                active: true
                            }, function(error, _updated) {
                                if (error || !_updated) {
                                    sails.log.error(error);
                                    cb('not_allowed');
                                } else {
                                    cb(null, {
                                        verified: true
                                    });
                                }
                            });
                        } else {
                            cb(null, {
                                verified: false
                            });
                        }

                    }

                });

            }

        });

    }

};