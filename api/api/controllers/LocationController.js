
module.exports = {
	
	
	setUserLocation: function(req, res){

		LocationService.setLocation(req.session.user.id, "user", req.allParams(), function(err, result){
			if (err) return res.err(err);
			return res.ok(result);
		});

	},

	getUsersByLocation: function(req, res){

		LocationService.getByLocation("user", req.allParams(), function(err, result){
			if (err) return res.err(err);
			return res.ok(result);
		});

	}


};