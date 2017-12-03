var moment = require('moment');
var objectid = require('objectid');
var Slack = require('slack-node');
var mnWebhookUri = sails.config.keys.SLACK_MN_WEBHOOK_URI;
module.exports = {

    site_visit: function(params, _cb) {

        if (params.site && params.page) {

            // SLACK

            // params.acceptedLanguages = params.acceptedLanguages.join(', ');
            // params.user = params.user ? params.user.id : 'unknwn';
            // params.smart_message_on = params.smart_message_on ? 'enabled' : 'disabled';
            // params.time = new Date();
            // params.site = params.site;
            // params.url = params.url;
            // params.page = params.page;
            // params.num_bubble_opens = params.num_bubble_opens;
            // params.num_visits = params.num_visits;

            // slack = new Slack();
            // slack.setWebhook(mnWebhookUri);
            // var fields = [];
            // for (var e in params) {
            //     if ([''].indexOf(e) < 0) {
            //         fields.push({
            //             title: e,
            //             value: params[e],
            //             short: false
            //         });
            //     }
            // }
            // slack.webhook({
            //     channel: "trackers",
            //     username: "Hey.TRACKER",
            //     icon_url: "https://lh3.googleusercontent.com/ERlp5QdPfuJeiU0_O5knXjnyvsoraJ2vfR3AaORksQR5ml63zLtyPL-i_umCSudkng=w300",
            //     attachments: [{
            //         fallback: params.c,
            //         pretext: params.c,
            //         color: "#F92672",
            //         fields: fields
            //     }]
            // }, function(err, response) {
            //     if (err) {
            //         console.log('error :: ', err);
            //     }
            // });

            // DB TRACKLIST
            var begin = moment(moment().format("YYYY-MM-DD")).toISOString();
            var end = moment(moment().format("YYYY-MM-DD")).add(1, 'days').toISOString();

            var _find_data = {
                tag: 'site_visit',
                time: { '>': begin, '<': end },
                user: params.user ? params.user.id : null,
                page: params.page,
                site: params.site
            };

            // console.log('find data', _find_data)

            Tracker.findOne(_find_data).exec(function(err, _tracker) {
                if (!_tracker) {

                    Tracker.create({
                        tag: 'site_visit',
                        language: params.acceptedLanguages,
                        user: params.user ? params.user.id : null,
                        page: params.page,
                        site: params.site,
                        url: params.url,
                        ip_address: params.ip,
                        time: new Date(),
                        meta: {
                            smart_message_on: params.smart_message_on ? true : false,
                            num_bubble_opens: params.num_bubble_opens ? params.num_bubble_opens : 0,
                            num_visits: params.num_visits ? params.num_visits : 0
                        }
                    }).exec(function(err, _tracker) {
                        if (err) {
                            sails.log.error(err);
                        } else {
                            _cb(null, _tracker);
                        }
                    });

                } else {
                    console.log('FOUND : ', _tracker);

                    Tracker.native(function(err, collection) {
                        var errorNext = function() {
                            sails.log.error('CANT INCREMENT TRACKER')
                        };

                        if (!err) {

                            var _inc_data = {};

                            if (params.num_bubble_opens) {
                                _inc_data['meta.num_bubble_opens'] = params.num_bubble_opens;
                            }
                            if (params.num_visits) {
                                _inc_data['meta.num_visits'] = params.num_visits;
                            }

                            collection.update({ _id: objectid(_tracker.id) }, { $inc: _inc_data }, function(err, results) {
                                if (err) {
                                    errorNext();
                                }
                            });

                        } else {
                            errorNext()
                        }
                    });

                    _cb(null, _tracker);
                }
            });
        }
        else {
            _cb();
        }
    },

};