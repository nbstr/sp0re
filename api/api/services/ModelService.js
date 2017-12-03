
var IGNORE_FIELDS= ["id", "createdAt", "updatedAt"];

var isOK = function(field){
	return field !== null && field !== undefined && field !== "";
};

module.exports = {

	/*
	*	Parse the incoming fields ("params") depending of the "options" parameter
	*	Options is either a string, an array of string or a JSON containing the name of one or more Models
	*	i.e.: if options == "User", the params will be parsed and validated depending of the attributes of the User model
	*
	*	If options is a JSON, it can contains diferent parameter as :
	* 		- required: true(default)/false  =>  if true, return an error if a required field is empty
	*		- name: {required: true(default)/false}  =>  Same as above but for a specific parameter (in the example, for name field of User)
	*		- modelName: true/false(default)  =>  if a model name is set to true, it will parse the incoming parameters and validate it if it contains the specific nested model
	*		- '*': true  =>  Parse and validate all nested models/collections (same as above but for all nested models/collections)
	*	
	*	{
	*		User: {
	*			Address: true || '*': true,
	*			required: true || name: {required, true},
	*		},
	*		... //multiple models can be given at once
	*	}
	*
	*	If there is no error, it returns an object containing all the fields sent:
	*		{
	*			User: {
	*				...
	*				address: {
	*					...
	*				}
	*			},
	*			{
	*				...
	*			}
	*
	*		}
	*/
	parse: function(options, params, cb){
		if (typeof(options) != "object")
			options = parseOptionsToJSON(options);

		//Set cb as an empty function if it's not a function already
		//and params to an empty json if it's undefined
		cb = typeof(cb) == "function" ? cb : function(){}; 
		params = params ? params : {};

		var res = {};
		var errors = { invalidAttributes: {} };

		async.forEachOf(options, function(opt, optKey, cb){
			
			//Simple parameter fields
			if (optKey === "fields"){
				var fields = opt;

				if (typeof(opt) === "string"){
					fields = [opt];
				}

				res.params = {};

				//ALL fields are required by default
				if(Array.isArray(fields)){
					for (var f in fields){
						var field = fields[f];
						if (!isOK(params[field])) {
							errors.invalidAttributes[field] = [{rule:"required"}];
						}
						else {
							res.params[field] = params[field];
						}
					}
				}

				//TODO check field type
				else if (typeof(fields) === "object"){
					for (var key in fields){
						var field = fields[key];
						//check required fields
						if (!isOK(params[key]) && (field === "required" || field === true || field === 1)) {
							errors.invalidAttributes[key] = [{rule:"required"}];
						}
						else if (isOK(params[key])) {
							res.params[key] = params[key];
						}
					}
				}

				else {
					return cb("'fields' must be an object, a string or a [string]");
				}

				return cb();
			}

			//handle user model with type
			if (optKey.indexOf("user_") > -1){
				res.user = {type: optKey.split("_")[1]};
				optKey = "user";
			}
			else{
				if (Array.isArray(params)){
					res[optKey] = [];
				}
				else {
					res[optKey] = {};
				}
			}
			// Return an error because the model doesn't exist (should happen only if typo in code)
			if (!sails.models[optKey]) {
				return cb("Model '" + optKey + "' doesn't exist");
			}

			var model = sails.models[optKey];
			if (typeof(opt) != "object")
				opt = {};
			
			parseModel(model, opt, params, res[optKey], errors, cb);

		}, function(err){
			if (err)
				return cb(err);
			if (_.isEmpty(errors.invalidAttributes))
				errors = null;

			return cb(errors, res);
		});

	},


};

var parseOptionsToJSON = function(options){
	//If an array is sent, change it in json fomrat: {model: true, model: true, ...}
	var tmp = {};
	if (Array.isArray(options)){
		for (var s in options){
			tmp[options[s]] = true;
		}
	}
	//If a string is sent, change it in json fomrat: {model: true}
	if (typeof(options) == "string") {
		tmp[options] = true;
	}
	return tmp;
};

var parseModel = function(model, opt, parameters, res, errors, callback){

	if (!Array.isArray(parameters)) {
		parseObject(model, parameters, opt, res, errors, callback);
	}

	else {
		var cpt = 0;
		async.each(parameters, function(params, cb){
			var obj = {};
			res[cpt] = obj;
			parseObject(model, params, opt, res[cpt], errors, cb);
			++cpt;
		}, callback);
	}

};

var parseObject = function(model, params, opt, res, errors, callback){
	//get attributes of the model
	var attrs = model.attributes;

	//Iterate over each attributes
	async.forEachOf(attrs, function(attr, attrKey, cb){

		//var attr = attrs[attrKey];

		//if attribute is a model, check if it's required from the options
		if (attr.model || attr.collection){
			var mod = attr.model || attr.collection;

			if (opt[attrKey] !== false && params[attrKey] && typeof(params[attrKey]) == "object" && !attr.noUpdate){
				res[attrKey] = {};
				//If required is set to true globaly, we set it to true for nested objects too
				if (typeof(opt[attrKey]) != "object") {
					opt[attrKey] = {};
				}
				if (opt.required === false && !opt[attrKey].required) {
					opt[attrKey].required = false;
				}
				parseModel(sails.models[mod], opt[attrKey], params[attrKey], res[attrKey], errors, cb);
			}
			else {
				cb();
			}
		}

		else {
			// Cannot update id, creation/update date (IGNORE_FIELDS)
			// or if custom attribute noUpdate is set to model
			// cannot use 'if (params[attrKey])' in case we want to send one of : [false, 0, ""...]
			if (IGNORE_FIELDS.indexOf(attrKey) === -1 && isOK(params[attrKey]) && !attr.noUpdate) {
				
				//TODO: handle dynamic user types
/*				if ((attr.onlyOwner && res.type !== "owner") || (attr.onlyWorker && res.type !== "worker")){
					return cb();
				}*/
				res[attrKey] = params[attrKey];
			}
			cb();
		}

	}, function(err){

		//Validate the model depending of the types/required/...
		model.validate(res, function(err){

			if (err && err.invalidAttributes) {
				for (var key in err.invalidAttributes) {
					var error = true;
					//if required is globally set to false in params, remove required errors
					//or if required is set to false in params (for specific param), remove required errors
					//or if the custome attribute noUpdate is set to true for the current field
					if (opt.required === false || (opt[key] && opt[key].required === false) || attrs[key].noUpdate){
						for (var errRule in err.invalidAttributes[key]){
							if (err.invalidAttributes[key][errRule].rule == "required")
								error = false;
						}
					}

					if (error) {
						errors.invalidAttributes[key] = err.invalidAttributes[key];
					}
				}
			}
			callback();
		});
	});
};