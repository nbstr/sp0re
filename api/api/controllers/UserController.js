var fs = require('fs'),
    request = require('request');

module.exports = {

    create: function(req, res) {
        CallbackService.createCallback(req, res, "user", UserService.create);
    },

    update: function(req, res) {
        CallbackService.createCallback(req, res, { user: { required: false } }, UserService.update);
    },

    softDelete: function(req, res) {
        CallbackService.createCallback(req, res, null, UserService.softDelete);
    },

    changePassword: function(req, res) {
        CallbackService.createCallback(req, res, { fields: ["password", "password_repeat", "old_password"] }, UserService.changePassword);
    },

    resetPassword: function(req, res) {
        CallbackService.createCallback(req, res, { fields: "email" }, UserService.resetPassword);
    },

    me: function(req, res) {
        CallbackService.createCallback(req, res, null, UserService.me);
    },

    validateEmail: function(req, res) {
        CallbackService.createCallback(req, res, { fields: "registrationToken" }, UserService.validateEmail);
    },

    resendConfirmation: function(req, res) {
        CallbackService.createCallback(req, res, { fields: "email" }, UserService.resendConfirmation);
    },

    checkEmail: function(req, res) {
        CallbackService.createCallback(req, res, null, UserService.checkEmail);
    },

    uploadUserPicture: function(req, res) {
        CallbackService.createCallback(req, res, {}, UserService.uploadUserPicture);
    },

    getSitesManaged: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.getSitesManaged(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    handshake: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.handshake(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    manageSite: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.manageSite(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    verifySite: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.verifySite(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    userRole: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.userRole(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    updateUserRole: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        UserService.updateUserRole(data, function(err, result) {
            if (err) return res.err(err);
            return res.json({
                success: true,
                result: result
            });
        });

    },

    makeCreator: function(req, res) {
        console.log('key' + sails.config.keys.ADMIN_SECRET);
        console.log('pwd' + req.param('password'));
        if (req.param('email') && req.param('password') && req.param('password') === sails.config.keys.ADMIN_SECRET) {
            DB.findOne(User, { email: req.param('email') }, function(err, user) {
                sails.log.debug('user : ', user.email);
                if (err || !user) return res.send(err);
                else {
                    DB.updateOne(User, user.id, {
                        type: 'creator'
                    }, function(err, upd_user) {

                        BugService.log({
                            author: 'admin task.',
                            title: 'NEW CREATOR',
                            bug: req.session.user.email + ' made a CREATOR out of ' + user.email
                        }, sails.log.error);

                        if (err) return res.json(err);
                        else return res.json({
                            success: true,
                            nfo: user.email + ' became a CREATOR.'
                        });
                    });
                }
            });
        } else {
            res.send(HACService.watch_user(req.session.user.email));
        }

    },

    makeAdmin: function(req, res) {
        if (req.param('email') && req.param('password') && req.param('password') === sails.config.keys.ADMIN_SECRET) {
            DB.findOne(User, { email: req.param('email') }, function(err, user) {
                sails.log.debug('user : ', user.email);
                if (err || !user) return res.send(err);
                else {
                    DB.updateOne(User, user.id, {
                        type: 'admin'
                    }, function(err, upd_user) {

                        BugService.log({
                            author: 'admin task.',
                            title: 'NEW ADMIN',
                            bug: req.session.user.email + ' made an ADMIN out of ' + user.email
                        }, sails.log.error);

                        if (err) return res.json(err);
                        else return res.json({
                            success: true,
                            nfo: user.email + ' became an ADMIN.'
                        });
                    });
                }
            });
        } else {
            res.send(HACService.watch_user(req.session.user.email));
        }
    },

    getPicture: function(req, res) {

        DB.findOne(User, req.param('user_id'), function(err, user) {

            console.log('user photo : ', user.picture);

            if (err) return res.send(err);
            if (!user) {
                return res.send();
            } else {

                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        console.log('content-type:', res.headers['content-type']);
                        console.log('content-length:', res.headers['content-length']);

                        request(uri).pipe(fs.createWriteStream(filename)).on('close', function(data) {
                            callback(data);
                        });
                    });
                };

                download(user.picture, user.id + '.jpg', function(img) {
                    res.send(img);
                });

            }
        });

    }

};