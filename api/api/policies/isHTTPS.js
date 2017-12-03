module.exports = function(req, res, next) {
    if (req.secure) {
    	console.log('already https')
        // Already https; don't do anything special.
        next();
    } else {
        // Redirect to https.
        console.log('redirecting to https')
        res.redirect('https://' + req.headers.host + req.url);
    }
};