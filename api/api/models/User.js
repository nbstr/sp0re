var bcrypt = require('bcrypt');

module.exports = {

    attributes: {

        //CUSTOM ATTRIBUTES HERE

        /* ... */

        //SHARED ATTRIBUTES

        /*
        {
            device_type,
            device_token,
            language
        }
        */
        settings: {
            type: "JSON"
        },

        email: {
            type: "EMAIL",
            required: true,
            unique: true
        },

        username: {
            unique: true
        },

        // facebook
        facebook_id: {
            unique: true
        },
        facebook_data: {
            type: 'JSON'
        },

        // google
        google_id: {
            unique: true
        },
        google_data: {
            type: 'JSON'
        },

        //new email, waiting to be confirmed
        new_email: {
            type: "EMAIL",
            unique: true
        },

        first_name: 'STRING',
        last_name: 'STRING',

        password: {
            type: 'STRING'
        },

        address: {
            collection: "Address",
            via: "user"
        },

        picture: 'STRING',

        pictures: 'JSON',

        points: {
            type: 'INTEGER',
            defaultsTo: 0
        },

        last_read_notifications: {
            type: 'DATE',
            defaultsTo: new Date()
        },

        flags: {
            type: 'INTEGER',
            defaultsTo: 0
        },

        //TYPE of user
        //type is "user" by default
        type: {
            type: 'STRING',
            enum: ["user", "admin", "creator"],
            defaultsTo: "user",
            //Custom attribute, the ModelService won't parse this value (user cannot update its type through request)
            //This needs the function type:noUpdates() below
            noUpdate: true
        },

        //Set this value to true when the user has validated his account (default to false)
        activated: {
            type: "BOOLEAN",
            defaultsTo: false,
            noUpdate: true
        },

        //Token used to enable a new account (the customer will have to go to an api route with this token in it)
        registrationToken: {
            type: "STRING",
            noUpdate: true
        },

        date_last_connection: {
            type: "DATE",
            noUpdate: true
        },

        toJSON: function() {
            var user = this.toObject();
            if (user.address && user.address[0]) {
                user.address = user.address[0];
                delete user.address.user;
                delete user.address.createdAt;
                delete user.address.updatedAt;
                delete user.address.id;
            } else {
                delete user.address;
            }

            delete user.password;
            delete user.activated;
            delete user.registrationToken;
            delete user.date_last_connection;
            return user;
        },

    },


    beforeCreate: function(user, cb) {
        hashPassword(user, cb);
    },

    beforeUpdate: function(user, cb) {
        hashPassword(user, cb);
    },


    beforeDestroy: function(criteria, cb) {
        cb();

        //Remove address that was linked to this user
        if (criteria.where && criteria.where.id) {
            Address.destroy({ user: criteria.where.id }).exec(function() {});
        }
    },

};

//Custom error, because if we only return an error as a string, it handles it and return an error response
var WLError = require('sails-hook-validation/node_modules/waterline/lib/waterline/error/WLError');
//To set a (new) password, set user.new_password and user.password_repeat
//The function check if the passwords match and return an error otherwise
//note: When we add an user with an address, it will create an user, then the address, then it will update the user back
//it updates all the user fields, and so when it comes here, it fails because password doesn't match password_repeat (which is undefined), so we use new_password here instead)
//See: https://github.com/marceloboeira/fish/blob/master/api/models/User.js
var hashPassword = function(user, cb) {
    delete user.password;

    //don't update password
    if (!user.new_password && !user.password_repeat) {
        return cb();
    }
    if (user.new_password !== user.password_repeat) {
        return cb(new WLError({ error: "passwords_error" }));
    }

    bcrypt.hash(user.new_password, 10, function(err, hash) {
        if (err) return cb(new WLError({ error: "passwords_error" }));
        user.password = hash;
        delete user.password_repeat;
        delete user.new_password;
        return cb();
    });
};