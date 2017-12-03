/**
 * Tracker.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
    	tag: 'STRING',
        user: {
            model: "User"
        },
        ip_address: 'STRING',
        url: 'STRING',
        country: 'STRING',
        language: 'STRING',
        time: 'DATE',
        meta: 'JSON',
    }
};