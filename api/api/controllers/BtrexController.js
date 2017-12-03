var _btrex = 'https://bittrex.com/api/v1.1';
var bittrex = require('node.bittrex.api');
// https://github.com/n0mad01/node.bittrex.api
bittrex.options({
    'baseUrl': _btrex,
    'apikey': sails.config.keys.BITTREX_KEY,
    'apisecret': sails.config.keys.BITTREX_SECRET,
    'stream': false, // will be removed from future versions
    'verbose': false,
    'cleartext': false,
    'inverse_callback_arguments': false,
});

// var url = 'https://bittrex.com/api/v1.1/public/getticker?market=BTC-LTC';
// bittrex.sendCustomRequest( url, function( data, err ) {
//   console.log( data );
// });

module.exports = {


    // ███╗   ███╗ █████╗ ██████╗ ██╗  ██╗███████╗████████╗███████╗
    // ████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝██╔════╝╚══██╔══╝██╔════╝
    // ██╔████╔██║███████║██████╔╝█████╔╝ █████╗     ██║   ███████╗
    // ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗ ██╔══╝     ██║   ╚════██║
    // ██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗███████╗   ██║   ███████║
    // ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝

    getmarketsummaries: function(req, res) {

        async.waterfall([
            // test url
            function(cb) {

                bittrex.getmarketsummaries(function(data, err) {
                    console.log('BITTREX MARKET CB : ', err);
                    cb(data);
                });
            },


        ], function(data) {
            return res.json(data);
        });

    },


    //  ██████╗ ██████╗ ██████╗ ███████╗██████╗       ██████╗  ██████╗  ██████╗ ██╗  ██╗
    // ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗      ██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝
    // ██║   ██║██████╔╝██║  ██║█████╗  ██████╔╝      ██████╔╝██║   ██║██║   ██║█████╔╝ 
    // ██║   ██║██╔══██╗██║  ██║██╔══╝  ██╔══██╗      ██╔══██╗██║   ██║██║   ██║██╔═██╗ 
    // ╚██████╔╝██║  ██║██████╔╝███████╗██║  ██║      ██████╔╝╚██████╔╝╚██████╔╝██║  ██╗
    //  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝      ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝

    getorderbook: function(req, res) {

        async.waterfall([
            // test url
            function(cb) {
                bittrex.getorderbook({ market: 'BTC-LTC', depth: 10, type: 'both' }, function(data, err) {
                    // console.log('BITTREX ORDERBOOK CB : ', data, err);
                    cb(data);
                });
            },


        ], function(data) {
            return res.json(data);
        });

    },

    // ██████╗  █████╗ ██╗      █████╗ ███╗   ██╗ ██████╗███████╗███████╗
    // ██╔══██╗██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝
    // ██████╔╝███████║██║     ███████║██╔██╗ ██║██║     █████╗  ███████╗
    // ██╔══██╗██╔══██║██║     ██╔══██║██║╚██╗██║██║     ██╔══╝  ╚════██║
    // ██████╔╝██║  ██║███████╗██║  ██║██║ ╚████║╚██████╗███████╗███████║
    // ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝

    getbalances: function(req, res) {

        async.waterfall([
            // test url
            function(cb) {
                bittrex.getbalances(function(data, err) {
                    console.log('BITTREX BALANCE CB : ', err);
                    cb(data);
                });
                // bittrex.getticker({market : 'USDT-NEO'}, function(data, err) {
                //     cb(data);
                // });
            },


        ], function(data) {
            return res.json(data);
        });

    },

    // TICKER

    getticker: function(req, res) {

        async.waterfall([
            // test url
            function(cb) {
                bittrex.getticker({market : req.param('market')}, function(data, err) {
                    cb(data);
                });
            },


        ], function(data) {
            return res.json(data);
        });

    },

    // ORDER HISTORY

    getorderhistory: function(req, res) {

        async.waterfall([
            // test url
            function(cb) {
                bittrex.getorderhistory({market : req.param('market')}, function(data, err) {
                    cb(data);
                });
            },


        ], function(data) {
            return res.json(data);
        });

    },

};

var _B = function(_url) {
    return _btrex + _url;
}