var Slack = require('slack-node');
var mnWebhookUri = sails.config.keys.SLACK_MN_WEBHOOK_URI;
module.exports = {

    bug: function(req, res) {
        $p = req.allParams();

        slack = new Slack();
        slack.setWebhook(mnWebhookUri);

        slack.webhook({
            channel: "bugs",
            username: "Super Mole™",
            icon_url: "https://www.mariowiki.com/images/thumb/c/cc/SMW_MontyMole.png/180px-SMW_MontyMole.png",
            attachments: [{
                fallback: "new bug..",
                pretext: "new bug..",
                color: "#00AEF9",
                fields: [{
                    title: $p.author,
                    value: $p.bug,
                    short: false
                }]
            }]
        }, function(err, response) {
            console.log(response);
            if (err) {
                res.json({
                    success: false,
                    error: err
                });
            } else {
                res.json({
                    success: true,
                    result: response
                });
            }

        });
    },

    bugImg: function(req, res) {
        $p = req.allParams();
        $content = JSON.parse($p.m);

        console.log('BUGS : ', $content);

        slack = new Slack();
        slack.setWebhook(mnWebhookUri);

        slack.webhook({
            channel: "bugs",
            username: "Hey.DEBUGGER",
            icon_url: "https://hey-hey.co/public/hey.png",
            attachments: [{
                fallback: $p.c,
                pretext: $p.c,
                color: "#F92672",
                fields: [{
                    title: 'error',
                    value: $content.error,
                    short: true
                },{
                    title: 'name',
                    value: $content.extra.name,
                    short: true
                },{
                    title: 'line',
                    value: $content.extra.line,
                    short: true
                },{
                    title: 'namespace',
                    value: $content.extra.namespace,
                    short: true
                },{
                    title: 'revision',
                    value: $content.extra.revision,
                    short: true
                },{
                    title: 'script',
                    value: $content.extra.script,
                    short: false
                },{
                    title: 'stack',
                    value: $content.extra.stack,
                    short: false
                },{
                    title: 'message',
                    value: $content.extra.message,
                    short: false
                }]
            }]
        }, function(err, response) {
            console.log(response);
            if (err) {
                res.json({
                    success: false,
                    error: err
                });
            } else {
                res.json({
                    success: true,
                    result: response
                });
            }

        });
    },

    create: function(req, res) {
        CallbackService.createCallback(req, res, "bug", BugService.create);
    },
    slack: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;

        BugService.slack(data, function(err, result) {
            if (err) return res.err(err);

            return res.json({
                success: true,
                result: result
            });
        });

    }


}
