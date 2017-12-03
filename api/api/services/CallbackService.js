
module.exports = {
	
	/* If no error happens, it returns an object containing :
	*	- req
	*	- res
	*	- any collection sent in fields (User, Tank,...)
	*/
	createCallback: function(req, res, fields, params, cb){

		if (typeof(params) === "function"){
			cb = params;
			params = req.allParams();
		}

		ModelService.parse(fields, params, function(err, result){

			if (err) return res.err(err);

			result.page = parsePagination(req);

			result.req = req;
			result.res = res;
			result.callback = function(err, result){
				if (err) return res.err(err);
				return res.ok(result);
			};

			return cb(result);

		});

	},

};

var parsePagination = function(req){
	var page = {};
	page.limit = req.allParams().limit || 10;
	page.offset = req.allParams().offset || 0;
	page.sort = req.allParams().sort;
	return page;
};