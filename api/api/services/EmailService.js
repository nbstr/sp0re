var TAG = "[Email service]";
var sendMail = function(data, cb) {

    sails.hooks.email.send(
        data.template,
        data.message_data, {
            to: data.email,
            subject: data.subject,
        },
        function(err) {
            if (err) sails.log.error(TAG, "Cannot send mail (template:", data.template, ", to:", data.email, ")", err);

            sails.log.warn(err || "ok email confirm");
            if (cb) return cb(err);
        }
    );
};

// INIT
var ink64 = {
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.;:/?,&@#()-_%*$=+<>'.split('')
};

// ERROR MGMT
if (ink64.alphabet.length > 100) {
    console.error('ink64 alphabet too smallto contain all characters..');
}

ink64.value = function(_index) {
    if (_index < 10) {
        return '0' + _index.toString();
    } else if (_index < 100) {
        return _index.toString();
    } else {
        console.error('ignored character : ' + ink64.alphabet[_index]);
        return '00';
    }
};

ink64.encode = function(_input) {
    var _output = [];
    if (typeof _input === 'string') {
        for (var c in _input) {
            _output.push(ink64.value(ink64.alphabet.indexOf(_input[c])));
        }
        return _output.join('');
    }
};

ink64.decode = function(_input) {
    var _output = [];
    if (typeof _input === 'string') {
        var _input = _input.match(/.{1,2}/g);
        for (var c in _input) {
            _output.push(ink64.alphabet[parseInt(_input[c])]);
        }
        return _output.join('');
    }
};

//TODO: add absolute link in text in mail for email validation

module.exports = {

    resetPassword: function(data) {

        var email_data = {
            template: "ResetPassword",
            email: data.email,
            subject: "Réinitialisation de votre mot de passe",
            message_data: {
                pwd: data.password
            }
        };
        sendMail(email_data, data.callback);
    },

    emailConfirmation: function(user) {
        //TODO
        var name;
        if (user.first_name) {
            name = user.first_name;
            if (user.last_name) {
                name += " " + user.last_name;
            }
        } else {
            name = user.email;
        }

        var email_data = {
            template: "emailConfirmation",
            email: user.email,
            subject: "Validation de votre adresse email",
            message_data: {
                registrationToken: user.registrationToken,
                registrationUrl: ((sails.config.environment === "production") ? 'https://hey-hey.co/users/validate/' : 'http://localhost:1337/users/validate/') + user.registrationToken,
                name: name,
                email: user.email
            }
        };
        sendMail(email_data);
    },

    newEmailConfirmation: function(user) {
        //TODO
        var name;
        if (user.first_name) {
            name = user.first_name;
            if (user.last_name) {
                name += " " + user.last_name;
            }
        } else {
            name = user.email;
        }

        var email_data = {
            template: "newEmailConfirmation",
            email: user.email,
            subject: "Validation de votre adresse email",
            message_data: {
                registrationToken: user.registrationToken,
                name: name,
                email: user.email
            }
        };
        sendMail(email_data);
    },

    sendBugReport: function(data) {

        var email_data = {
            template: "bugSent",
            email: data.email,
            subject: 'Un bug a été rapporté',
            message_data: {
                name: data.name,
                message: data.message
            }
        };

        sendMail(email_data);
    },

    newAnswer: function(data, cb) {

    	console.log('ID', data.id);
    	console.log('ENCODED', ink64.encode(data.id));

        var email_data = {
            template: "newAnswer",
            email: data.email,
            subject: 'Someone replied to you',
            message_data: {
                name: data.name,
                content: data.content,
                url: data.url + '?hey=ncr.a.' + data.id
            }
        };

        sendMail(email_data, cb);
    },

};