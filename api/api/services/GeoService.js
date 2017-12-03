// ParameterService.js - in api/services

var geocoderProvider = 'google';
var httpAdapter = 'https';
// optionnal 
var extra = {
    apiKey: '', // for Mapquest, OpenCage, Google Premier 
    formatter: null                                    // 'gpx', 'string', ... 
};
 
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

module.exports = {

    getCoordinates: function(address, cb) {

        var addString = address.street || "";
        addString += " " + (address.num || "");
        addString += " " + (address.postcode || "");
        addString += " " + (address.city || "");
        addString += " " + (address.country || "");

        geocoder.geocode(addString, function(err, res) {
            if (err || !res[0]) return cb("geocode_wrong");
            
            res = res[0];
            return cb(null, {latitude: res.latitude, longitude: res.longitude});
        });
    },

    getAddress: function(coords, cb){

        if (!coords.latitude || !coords.longitude) return cb({type:"required", info:"location"});

        geocoder.reverse({lat:coords.latitude, lon:coords.longitude}, function(err, res){
            if (err || !res[0]) return cb("geocode_wrong");
            res = res[0];

            var address = {};
            if (res.streetName) address.street = res.streetName;
            if (res.streetNumber) address.street += ", " + res.streetNumber;
            if (res.zipcode) address.postcode = res.zipcode;
            if (res.city) address.city = res.city;
            if (res.country) address.country = res.country;

            return cb(null, address);
        });

    }

};


