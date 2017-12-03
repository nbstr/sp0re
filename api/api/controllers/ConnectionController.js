var bcrypt = require('bcrypt');
var request = require('request');

module.exports = {

    // ███████╗███╗   ███╗ █████╗ ██╗██╗           ██████╗ ██╗    ██╗██████╗ 
    // ██╔════╝████╗ ████║██╔══██╗██║██║           ██╔══██╗██║    ██║██╔══██╗
    // █████╗  ██╔████╔██║███████║██║██║     █████╗██████╔╝██║ █╗ ██║██║  ██║
    // ██╔══╝  ██║╚██╔╝██║██╔══██║██║██║     ╚════╝██╔═══╝ ██║███╗██║██║  ██║
    // ███████╗██║ ╚═╝ ██║██║  ██║██║███████╗      ██║     ╚███╔███╔╝██████╔╝
    // ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝      ╚═╝      ╚══╝╚══╝ ╚═════╝ 

    login: function(req, res) {

        CallbackService.createCallback(req, res, { "user": { required: false } }, function(data) {

            var email = data.user.email,
                password = data.user.password,
                customCB = data.callback;

            var cb = function(err, result) {
                if (err) UserService.disconnect(data.req);
                return customCB(err, result);
            }

            if (!email) return cb({ type: "required", info: "email" });
            if (!password) return cb({ type: "required", info: "password" });

            DB.findOne(User, { email: email }, { populate: "address", keep: ["password", "activated"] }, function(err, user) {
                if (err) return cb(err);
                if (!user) return cb("login_failed");

                bcrypt.compare(password, user.password, function(err, res) {
                    if (err) return cb(err);
                    if (!res) return cb("login_failed");

                    if (sails.config.params.send_confirmation_mail === true && user.activated !== true) {
                        return cb("email_not_confirmed");
                    }

                    delete user.password;
                    delete user.activated;
                    UserService.connect(user, req);

                    DB.updateOne(User, user, { date_last_connection: new Date() }, function() {});

                    return cb(null, user);
                });
            });

        });
    },

    // ███████╗ █████╗  ██████╗███████╗██████╗  ██████╗  ██████╗ ██╗  ██╗
    // ██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝
    // █████╗  ███████║██║     █████╗  ██████╔╝██║   ██║██║   ██║█████╔╝ 
    // ██╔══╝  ██╔══██║██║     ██╔══╝  ██╔══██╗██║   ██║██║   ██║██╔═██╗ 
    // ██║     ██║  ██║╚██████╗███████╗██████╔╝╚██████╔╝╚██████╔╝██║  ██╗██╗
    // ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝

    loginFacebookCallback: function(req, res) {
        res.json({
            success: true,
            data: 'ok'
        });
    },
    loginFacebook: function(req, res) {

        var hey_redirect_uri;

        async.waterfall([
            // check if facebook callback has valid response
            function(cb) {
                sails.log.debug('#1 - getting code from facebook.');

                if (req.param('error') || !req.param('code')) {
                    /**
                     *  @param error (ex. user_denied)
                     *  @param error_reason (ex. access_denied)
                     *  @param error_description (ex. The+user+denied+your+request.)
                     */
                    sails.log.error('facebook_login_error : ' + req.param('error_description'));

                    return cb(req.param('error') ? (req.param('error').error ? req.param('error').error : req.param('error')) : 'Cannot login, try again later');

                } else {
                    /**
                     *  @param code
                     *  @param expires_in
                     */
                    hey_redirect_uri = req.param('hey_redirect_uri');
                    cb(null, req.param('code'), req.param('expires_in'));
                }
            },

            // exchange code vs accesstoken
            function(code, expires_in, cb) {

                sails.log.debug('#2 - code vs access_token');

                var redirect_uri = ((process.env.NODE_ENV === "production" ? "https://hey-hey.co" : "http://localhost:1337") + '/api/v1/login/facebook');

                request.get({
                    url: 'https://graph.facebook.com/v2.8/oauth/access_token',
                    qs: {
                        client_id: sails.config.keys.FACEBOOK_CLIENT_ID,
                        client_secret: sails.config.keys.FACEBOOK_CLIENT_SECRET,
                        redirect_uri: redirect_uri,
                        code: code
                    },
                    json: true
                }, function(error, response, body) {
                    if (error ||  (body.error && body.error.message)) {
                        sails.log.error('expired code error : ', error);
                        sails.log.error('expired code body : ', body);
                        cb('the code is expired');
                    } else {
                        cb(null, body.access_token, body.expires_in);
                    }

                });
            },

            // extend access_token
            // function(access_token, expires_in, cb) {

            //     sails.log.debug('#3 - extending access_token');

            //     // #3 - Generate a long-lived token
            //     request.get({
            //         url: 'https://graph.facebook.com/oauth/access_token',
            //         qs: {
            //             grant_type: 'fb_exchange_token',
            //             client_id: sails.config.keys.FACEBOOK_CLIENT_ID,
            //             client_secret: sails.config.keys.FACEBOOK_CLIENT_SECRET,
            //             fb_exchange_token: access_token
            //         },
            //         json: true
            //     }, function(error, response, body) {

            //         var _params = {};

            //         if (typeof body === 'string' && body.indexOf('=') > -1 && !error) {
            //             body = body.split('&');
            //             for (var a in body) {
            //                 _params[body[a].split('=')[0]] = body[a].split('=')[1];
            //             }

            //             cb(null, _params.access_token, _params.expires);

            //         } else if (body && body.access_token) {
            //             cb(null, body.access_token, body.expires_in);

            //         } else {
            //             // something wrong happend..
            //             sails.log.error('step #3', body);
            //             cb('Could not generate an access token');
            //         }
            //     });


            // },

            // get user info
            function(access_token, expires_in, cb) {

                sails.log.debug('#4 - getting user info');

                // #4 - Get user info
                request.get({
                    url: 'https://graph.facebook.com/me',
                    qs: {
                        access_token: access_token,
                        fields: sails.config.params.facebook.permissions.join(',')
                    },
                    json: true
                }, function(error, response, body) {

                    body.access_token = access_token;
                    cb(error, body);

                });


            },

            // find or create user
            function(data, cb) {

                sails.log.debug('#5 - finding user in db : ', data.id);

                User.findOne({
                    or: [
                        { email: data.email },
                        { facebook_id: data.id }
                    ]
                }).exec(function(user_error, user) {
                    if (user_error) {
                        sails.log.debug('error searching user', user_error);
                        cb('unknown_error');
                    } else if (!user) {
                        sails.log.debug('user not found, we need to create him');

                        UserService.create({
                            user: {
                                facebook_id: data.id,
                                email: data.email,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                picture: 'http://graph.facebook.com/v2.8/' + data.id + '/picture?type=square&width=360',
                                facebook_data: {
                                    email: data.email,
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    picture: 'http://graph.facebook.com/v2.8/' + data.id + '/picture?type=square&width=360'
                                }
                            },
                            req: req,
                            callback: function(error, new_user) {
                                new_user.access_token = data.access_token;
                                cb(null, new_user);
                            }
                        });

                    } else {
                        if (user.facebook_id) {
                            // already registered as google user : LOGIN
                            sails.log.debug('user found');
                            user.access_token = data.access_token;
                            cb(null, user);

                        } else {
                            var updated_user = {
                                facebook_id: data.id,
                                facebook_data: {
                                    email: data.email,
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    picture: 'http://graph.facebook.com/v2.8/' + data.id + '/picture?type=square&width=360'
                                }
                            };
                            if (!user.picture) {
                                updated_user.picture = updated_user.facebook_data.picture;
                            }
                            // registered with email, linking to google account
                            DB.updateOne(User, user.id, updated_user, { populate: "address" }, function(err, upd_user) {
                                if (err) {
                                    return cb(err);
                                } else {
                                    cb(null, upd_user);
                                }
                            });

                        }
                    }

                });


            },

            // login user
            function(user, cb) {

                sails.log.debug('#6 - logging user');

                UserService.connect(user, req);

                cb(null, user);

            }

        ], function(error, data) {
            var view_data = {
                error: false,
                hey_redirect_uri: 'https://hey-hey.co'
            };

            if (error) {
                sails.log.error(error);
                view_data.error = error && error.error_description ? error.error_description : error;
            }

            if (hey_redirect_uri) {
                view_data.hey_redirect_uri = new Buffer(hey_redirect_uri, 'base64').toString('ascii');
            }

            // render view
            return res.view('viewTemplates/facebookRedirect/html', view_data);
        });

    },

    //  ██████╗  ██████╗  ██████╗  ██████╗ ██╗     ███████╗
    // ██╔════╝ ██╔═══██╗██╔═══██╗██╔════╝ ██║     ██╔════╝
    // ██║ ████╗██║   ██║██║   ██║██║ ████╗██║     █████╗  
    // ██║   ██║██║   ██║██║   ██║██║   ██║██║     ██╔══╝  
    // ╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████╗██╗
    //  ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚═╝

    loginGoogleCallback: function(req, res) {
        res.json({
            success: true,
            data: 'ok'
        });
    },
    loginGoogle: function(req, res) {

        var hey_redirect_uri;

        async.waterfall([
            // check if facebook callback has valid response
            function(cb) {
                sails.log.debug('#1 - getting code from google.');

                if (req.param('error') || !req.param('code')) {
                    /**
                     *  @param error (ex. user_denied)
                     *  @param error_reason (ex. access_denied)
                     *  @param error_description (ex. The+user+denied+your+request.)
                     */
                    sails.log.error('google_login_error : ' + req.param('error'));

                    return cb({
                        error: req.param('error'),
                        error_reason: req.param('error'),
                        error_description: req.param('error')
                    });

                } else {
                    /**
                     *  @param code
                     *  @param expires_in
                     */
                    hey_redirect_uri = req.param('hey_redirect_uri');
                    sails.log.debug('code', req.param('code'));
                    cb(null, req.param('code'), req.param('expires_in'));
                }
            },

            // exchange code vs accesstoken
            function(code, expires_in, cb) {

                var redirect_uri = ((process.env.NODE_ENV === "production" ? "https://hey-hey.co" : "http://localhost:1337") + '/api/v1/login/google');
                var qs = {
                    client_id: sails.config.keys.GOOGLE_CLIENT_ID,
                    client_secret: sails.config.keys.GOOGLE_CLIENT_SECRET,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code',
                    code: code
                };
                sails.log.debug('#2 - code vs access_token');
                request.post({
                    url: 'https://www.googleapis.com/oauth2/v4/token',
                    qs: qs,
                    json: true
                }, function(error, response, body) {
                    if (error ||  (body && body.error)) {
                        sails.log.error('expired code error : ', body.error);
                        cb(body.error || 'the code is expired');
                    } else {
                        cb(null, body.access_token, body.refresh_token, body.expires_in);
                    }

                });
            },

            // extend access_token
            // function(access_token, expires_in, cb) {

            //     sails.log.debug('#3 - extending access_token');

            //     // #3 - Generate a long-lived token
            //     request.get({
            //         url: 'https://graph.facebook.com/oauth/access_token',
            //         qs: {
            //             grant_type: 'fb_exchange_token',
            //             client_id: sails.config.keys.FACEBOOK_CLIENT_ID,
            //             client_secret: sails.config.keys.FACEBOOK_CLIENT_SECRET,
            //             fb_exchange_token: access_token
            //         },
            //         json: true
            //     }, function(error, response, body) {

            //         var _params = {};

            //         if (typeof body === 'string' && body.indexOf('=') > -1 && !error) {
            //             body = body.split('&');
            //             for (var a in body) {
            //                 _params[body[a].split('=')[0]] = body[a].split('=')[1];
            //             }

            //             cb(null, _params.access_token, _params.expires);

            //         }
            //         else if(body && body.access_token){
            //             cb(null, body.access_token, body.expires_in);

            //         } else {
            //             // something wrong happend..
            //             sails.log.error('step #3', body);
            //             cb('Could not generate an access token');                        
            //         }
            //     });


            // },

            // get user info
            function(access_token, refresh_token, expires_in, cb) {

                sails.log.debug('#4 - getting user info');

                // #4 - Get user info
                request.get({
                    url: 'https://www.googleapis.com/oauth2/v1/userinfo',
                    qs: {
                        access_token: access_token,
                        alt: 'json',
                        // fields: sails.config.params.facebook.permissions.join(',')
                    },
                    json: true
                }, function(error, response, body) {
                    sails.log.debug('user', body);
                    body.access_token = access_token;
                    if (refresh_token) {
                        body.refresh_token = refresh_token;
                    }
                    cb(error, body);

                });


            },

            // find or create user
            function(data, cb) {

                sails.log.debug('#5 - finding user in db : ', data.id);

                User.findOne({
                    or: [
                        { email: data.email },
                        { google_id: data.id }
                    ]
                }).exec(function(user_error, user) {
                    if (user_error) {
                        sails.log.debug('error searching user', user_error);
                        cb('unknown_error');
                    } else if (!user) {
                        sails.log.debug('user not found, we need to create him');

                        UserService.create({
                            user: {
                                google_id: data.id,
                                email: data.email,
                                first_name: data.given_name,
                                last_name: data.family_name,
                                picture: data.picture,
                                google_data: {
                                    first_name: data.given_name,
                                    last_name: data.family_name,
                                    picture: data.picture,
                                    link: data.link,
                                    verified_email: data.verified_email,
                                    refresh_token: data.refresh_token
                                }
                            },
                            req: req,
                            callback: function(error, new_user) {
                                new_user.access_token = data.access_token;
                                cb(null, new_user);
                            }
                        });

                    } else {
                        if (user.google_id) {
                            // already registered as google user : LOGIN
                            sails.log.debug('user found');
                            user.access_token = data.access_token;
                            cb(null, user);

                        } else {
                            // registered with email, linking to google account
                            var updated_user = {
                                google_id: data.id,
                                google_data: {
                                    first_name: data.given_name,
                                    last_name: data.family_name,
                                    email: data.email,
                                    picture: data.picture,
                                    link: data.link,
                                    verified_email: data.verified_email,
                                    refresh_token: data.refresh_token
                                }
                            };

                            if (!user.picture) {
                                updated_user.picture = updated_user.google_data.picture;
                            }

                            DB.updateOne(User, user.id, updated_user, { populate: "address" }, function(err, upd_user) {
                                if (err) {
                                    return cb(err);
                                } else {
                                    cb(null, upd_user);
                                }
                            });

                        }
                    }

                });


            },

            // login user
            function(user, cb) {

                sails.log.debug('#6 - logging user');

                UserService.connect(user, req);

                cb(null, user);

            }

        ], function(error, data) {

            var view_data = {
                error: false,
                hey_redirect_uri: 'https://hey-hey.co'
            };

            if (error) {
                sails.log.error(error);
                view_data.error = error && error.error_description ? error.error_description : error;
            }

            if (hey_redirect_uri) {
                view_data.hey_redirect_uri = new Buffer(hey_redirect_uri, 'base64').toString('ascii');
            }

            // render view
            return res.view('viewTemplates/googleRedirect/html', view_data);
        });

    },

    logout: function(req, res) {
        UserService.disconnect(req);
        return res.ok();
    },

};
