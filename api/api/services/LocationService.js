
module.exports = {
	

	setLocation: function(obj_id, type, params, cb){

		var coords = getCoordinates(params);
		if (!coords) return cb({type:"required", info:"location"});

		DB.setLocation(obj_id, type, coords, cb);

	},

	getByLocation: function(type, params, cb){

		var coords = getCoordinates(params);
		if (!coords) return cb({type:"required", info:"location"});

		DB.getByLocation(type, coords, params.radius, cb);

	}


};

var getCoordinates = function(params){

	if (params.latitude===null || params.latitude===undefined || params.longitude===null || params.longitude===undefined || isNaN(params.latitude) || isNaN(params.longitude)){
		return null;
	}

	return {
		latitude: parseFloat(params.latitude),
		longitude: parseFloat(params.longitude)
	};

};