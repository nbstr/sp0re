var Slack = require('slack-node');
var mnWebhookUri = sails.config.keys.SLACK_MN_WEBHOOK_URI;
module.exports = {

    create: function(data) {

        var bug = data.bug,
            callback = data.callback,
            user = data.session.user;

        bug.user = user.id;

        var name = user.first_name || "";
        if (name !== "")
            name += " ";
        name += user.last_name;
        if (name === "")
            name = user.email;
        else
            name += " <" + user.email + ">";

        for (var k in sails.config.params.bug_report_email) {
            var email = sails.config.params.bug_report_email[k];
            EmailService.sendBugReport({
                name: name,
                message: bug.comment,
                email: email
            });
        }

        DB.create(Bug, bug, callback);
    },

    slack: function(data, cb) {

        data.author = data.author ? data.author : (data.user.first_name + data.user.last_name);
        data.title = data.title ? data.title : 'new bug..';

        slack = new Slack();
        slack.setWebhook(mnWebhookUri);

        slack.webhook({
            channel: "bugs",
            username: "ナブスター",
            icon_url: "https://www.mariowiki.com/images/thumb/c/cc/SMW_MontyMole.png/180px-SMW_MontyMole.png",
            attachments: [{
                fallback: data.title,
                pretext: data.title,
                color: "#00AEF9",
                fields: [{
                    title: data.author,
                    value: data.bug,
                    short: false
                }]
            }]
        }, function(err, response) {
            console.log(response);
            if (err) {
                cb(err);
            } else {
                cb(null, response);
            }

        });
    },

    log: function(data, cb) {

        if (!data.productionOnly || sails.config.environment === "production") {

            data.author = data.author ? data.author : 'Hey';
            data.title = data.title ? data.title : 'new bug..';
            data.content = data.content ? data.content : (data.bug ? data.bug : '—');
            data.color = data.color ? data.color : '#00AEF9';
            data.channel = data.channel ? data.channel : 'bugs';
            data.icon = data.icon ? data.icon : 'http://media.oregonlive.com/ent_impact_home/photo/super-mariojpg-11d71ebbb49b2faa.jpg';

            slack = new Slack();
            slack.setWebhook(mnWebhookUri);

            slack.webhook({
                channel: data.channel,
                username: "ナブスター",
                icon_url: data.icon,
                attachments: [{
                    fallback: data.title,
                    pretext: data.title,
                    color: data.color,
                    fields: [{
                        title: data.author,
                        value: data.content,
                        short: false
                    }]
                }]
            }, function(err, response) {
                console.log(response);
                if (err) {
                    cb(err);
                } else {
                    cb(null, response);
                }

            });
        }

    },

}