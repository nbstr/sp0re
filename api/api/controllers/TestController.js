module.exports = {


    get: function(req, res) {
        res.json({
            error: false,
            data: "Hello World !"
        })
    },

    ssl: function(req, res) {
        res.send('wAWe3wSETcRwXvLdxSOn_t6RdJNUuYVhkY2okXzESQU.BGdEaLU8ouUTtqWLh0eshl1x25ih_ZyOcmUztzJAHCk')
    },

    mail: function(req, res) {
        var _email_data = {
            email: 'cookieklub@gmail.com',
            name: 'Nabil Kamel',
            content: 'TESTING EMAILS'
        };
        EmailService.newAnswer(_email_data, function(error, data){
            sails.log.debug('#################################\nERROR\n#################################', error);
            sails.log.debug('#################################\nDATA\n#################################', data);
            return res.json({
                error: error,
                nfo: 'ink',
                version: 1,
                dta: data
            });
        });
    },

    facebookWebhook: function(req, res) {
        if (req.param('hub.mode') === 'subscribe' && req.param('hub.verify_token') === sails.config.keys.FACEBOOK_MESSENGER_TOKEN ) {
            console.log("Validating webhook");
            res.status(200).send(req.param('hub.challenge'));
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
        res.send('1846716824')
    },

    testAllLogs: function(req, res) {
        Log("error", 0);
        Log("error", "e");
        Log("error", "err");
        Log("error", "error");
        L.e("error");
        L.err("error");
        L.error("error");

        Log("warn", 1);
        Log("warn", "w");
        Log("warn", "warn");
        L.w("warn");
        L.warn("warn");

        Log("debug");
        Log("debug", 2);
        Log("debug", "d");
        Log("debug", "l");
        Log("debug", "log");
        Log("debug", "debug");
        L.d("debug");
        L.l("debug");
        L.log("debug");
        L.debug("debug");

        Log("info", 3);
        Log("info", "i");
        Log("info", "info");
        L.i("info");
        L.info("info");

        return res.ok();
    },

    post: function(req, res) {

        return res.err("unknow");

    },

    e500: function(req, res) {

        return res.serverError();

    },


    delete: function(req, res) {

        return res.err("unknow");

    },


    patch: function(req, res) {

        return res.err("unknow");

    },


    put: function(req, res) {

        return res.err("unknow");

    },

};