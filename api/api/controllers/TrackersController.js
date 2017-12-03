module.exports = {

    site_visit: function(req, res) {

        var data = req.allParams();
        data.ip = req.headers['x-forwarded-for'] || req.ip;
        data.user = req.session.user;
        data.acceptedLanguages = req.acceptedLanguages;

        TrackersService.site_visit(data, function(err, result) {
            if (err) return res.err(err);

            return res.json({
                success: true,
                result: result
            });
        });

        
        // res.json({
        //     error: false,
        //     data: "Hello World !"
        // });
    },

};