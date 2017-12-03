var objectid = require('objectid');
var DEF_LIMIT = 10;
var MAX_LIMIT = 50;

var TAG = "[DB]";

var ERR = "db_error";

/**

	Waterline Queries :
	===================

	> A query is generally a json Object.
	> It will make an "AND" query, so it'll return entities matching all fields  
	================================
	|							   |
	|	{						   |
	|		first_name: "John",	   |
	|		last_name: "Doe",	   |
	|	}						   |
	|							   |
	================================


	Criterias:
	----------

	> 'param' is the name of the field to query on. It can be either a string or a 'parameter' ()
	
	':' / '=='						: 	{param: "value"}	//	{param: {"==": "value"}}
    '<' / 'lessThan'				:	{param: {'<'	: 5}}
    '<=' / 'lessThanOrEqual'		:	{param: {'<='	: '2016-05-01'}}
    '>' / 'greaterThan'				:	{param: {'>'	: 5}}
    '>=' / 'greaterThanOrEqual'		:	{param: {'>='	: '2016-05-01'}}
    '!' / 'not'						:	{param: {'!'	: 'Julien'}}
    'like'							:	{param: {'like'	: '%lien'}}

    'contains'						:	{'param': {'contains': 'uli'}}  	//  Same as {name: {'like': '%uli%'}}
    'startsWith'					:	{'param': {'startsWith': 'Jul'}}  	//  Same as {name: {'like': 'Jul%'}}
    'endsWith'						:	{'param': {'endsWith': 'lien'}}  	//  Same as {name: {'like': '%lien'}}
 */


module.exports = {

    create: function(Model, object, options, cb) {

        var data = parseParameters(Model, {}, options, cb);
        if (!data) return cb(ERR);
        options = data.options;
        cb = data.cb;

        Model.create(object).exec(function(err, obj) {
            if (err) return cb(err);
            if (_.isEmpty(options) || Array.isArray(obj)) return cb(null, obj);
            DB.get(Model, obj.id, options, cb);
        });

    },

    /**
     * Return the entity corresponding to the 'id' parameter
     * @param  {Waterline}  Model   	Model on which the query is done
     * @param  {string}   	id      	id of the entity
     * @param  {Object}   	options 	[optionnal] : (see options from find() below)
     * @param  {Function} 	cb      	Callback function
     * @return {Object}           		The entity corresponding to the id from the Model table
     */
    get: function(Model, obj, options, cb) {

        var data = parseParameters(Model, {}, options, cb);
        if (!data) return cb(ERR);
        options = data.options;
        cb = data.cb;

        if (typeof(obj) === "object") {
            if (obj.id) obj = obj.id;
            else {
                L.err(TAG, "if 'obj' in get() is an object, it must contains an .id field");
                return cb(ERR);
            }
        }
        if (typeof(obj) !== "string") {
            L.err(TAG, "'obj' in get() must be an Object with .id or string containing the id of the entity to update");
            return cb(ERR);
        }

        var findQuery = Model.find({ id: obj }, { select: options.select });

        populateQuery(findQuery, options);

        findQuery.exec(function(err, result) {
            if (err) return cb(err);
            result = result && result[0] ? result[0] : null;
            return doProjection(result, options, cb);
        });
    },

    /**
     * Returns an Array of entity objects from the Model matching the query parameters.
     * 
     * @param  {Waterline}				Model   	Model sur lequel faire la query
     * @param  {Object|Array|string}   	query   	Waterline query (if it's a string, it does a findById : query == {id: query})
     * @param  {Object}   				options 	[optionnal] :
     * {
     * 		sort: string || [string] || object 	
     * 		//Sort results by this value (ex: 'date' will sort by date ASC, for DESC : 'date DESC'
     * 		//For multiple sort, either :
     * 		//  an Array  : ["first_name", "last_name DESC"]
     * 		//	an Object : { first_name:1, last_name:0 }	// 1 === "ASC", 0 === "DESC"
     * 			
     * 		limit: int 			//Limit entity objects in result, default to {{DEF_LIMIT}}
     * 		offset: int,
     * 		
     * 		or: boolean, def:false			//Do an 'OR' query instead of an 'AND' // 'query' can either be an Object or an Array
     *
     * 		populate: string | [string] | Object,
     * 		//Populate entities with the corresponding model(s) from 'populate'
     * 		//To do a populate query, use an object instead of a string (array) :
     * 		{
     * 			"address": {street: "street 4"}
     * 		}
     * 		
     * 		populated: boolean || string || [string], def:false		
     * 		//if true, only returns entities which have all populated values from 'populate' param
     * 		//if it's a string(or [string]), return entities which have all populated values from the string(s) param (values must be contained in 'populate')
     *
     *		fields: string || [string]		//only returns entities that have these fields 
     *		keep: string || [string]		//keep the fields from these entities (which are normally deleted, like password)
     * 
     * 		deleted: boolean				//also returns entities that has been soft 'deleted'
     * 		deletedOnly: boolean			//only returns entities that has been soft 'deleted'
     * 		
     * 		select: string || [string]		//Select only attributes from each entity given in the select
     * 		unselect: string || [string]	//Select all but attributes from each entity given in unselect (if select is set, unselect is not used)
     *
     * 		native: boolean,	//if true, do a native mongo db query. Other options are not used (except sort / TODO: limit/offset?)
     * }
     * @param  {Function} cb      	Callback function: cb(error, result)
     * @return {[Object]}			Array of entity Object
     */
    find: function(Model, query, options, cb) {

        //Do a native query for specific MongoDB query
        if (options && options.native === true) {
            return DB.findNativeMongoQuery(Model, query, options, cb);
        }

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;


        //QUERY
        var findQuery = Model.find(query, { select: options.select });

        //SORT
        if (options.sort) {
            findQuery = findQuery.sort(options.sort);
        }

        //LIMIT  -  limit is either set in options or default value is used (DEF_LIMIT)
        findQuery = findQuery.limit(options.limit);

        //OFFSET
        if (options.offset) {
            findQuery = findQuery.skip(options.offset);
        }

        //POPULATE
        populateQuery(findQuery, options);

        //EXECUTION
        findQuery.exec(function(err, result) {
            if (err) return cb(err);
            return doProjection(result, options, cb);
        });
    },

    /**
     * Return the first entity object from the Model matching the query parameters
     * See params info's in find() above
     */
    findOne: function(Model, query, options, cb) {

        if (typeof(options) === "function") {
            cb = options;
            options = {};
        }

        DB.find(Model, query, options, function(err, result) {
            result = result && result[0] ? result[0] : null;
            return cb(err, result);
        });
    },

    update: function(Model, query, fields, options, cb) {

        if (!fields) {
            L.err(TAG, "'fields' parameter is required");
            return cb(ERR);
        }

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;


        //If query is null or not an object, set it to empty object (careful: typeof(null) === "object")
        if (_.isEmpty(query)) {

            if (options.updateAll === true) {
                query = {};
                L.err(TAG, "Updating all entities of the Model '" + Model.adapter.identity + "'");
            } else {
                L.err(TAG, "Trying to update all entities of the Model '" + Model.adapter.identity + "' without setting options.updateAll to true");
                return cb(ERR);
            }
        }

        Model.update(query, fields).exec(function(err, result) {
            if (err) return cb(err);

            //If there is not sorting and populate options, we can just return the result, otherwise we need to sort and populate with a new find query
            if (!options.sort && !options.populate) {
                return doProjection(result, options, cb);
            }

            var ids = _.pluck(result, "id");
            var findQuery = Model.find({ id: ids }, { select: options.select });

            if (options.sort) {
                findQuery = findQuery.sort(options.sort);
            }

            populateQuery(findQuery, options);
            findQuery.exec(function(err, result) {
                if (err) return cb(err);
                return doProjection(result, options, cb);
            });
        });

    },

    updateOne: function(Model, query, fields, options, cb) {

        if (typeof(options) === "function") {
            cb = options;
            options = {};
        }

        if (typeof(query) === "object") {
            if (query.id) query = query.id;
            else {
                L.err(TAG, "if 'query' in updateOne() is an object, it must contains an .id field");
                return cb(ERR);
            }
        }
        if (typeof(query) !== "string") {
            L.err(TAG, "'query' in updateOne() must be an Object with .id or string containing the id of the entity to update");
            return cb(ERR);
        }

        query = { id: query };

        DB.update(Model, query, fields, options, function(err, res) {
            if (res && res[0]) {
                return cb(err, res[0]);
            } else return cb(err);
        });
    },

    inc: function(Model, _id, field, inc_value, cb) {
        var data = {};
        data[field] = parseInt(inc_value);

        Model.native(function(err, collection) {
            var errorNext = function(error) {
                sails.log.error('error : ', error);
            };
            if (!err) {
                collection.update(objectid(_id), { $inc: { data } }, function(err, results) {
                    if (err) {
                        errorNext('could not increment');
                    } else if (typeof cb === 'function') {
                        cb(results);
                    }
                });

            } else {
                errorNext('cannot find model..')
            }
        });
    },

    //TODO finish function
    put: function(Model, query, fields, options, cb) {

        if (!fields) {
            L.err(TAG, "'fields' parameter is required");
            return cb(ERR);
        }

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;


        //If query is null or not an object, set it to empty object (careful: typeof(null) === "object")
        if (_.isEmpty(query)) {

            if (options.updateAll === true) {
                query = {};
                L.err(TAG, "Updating all entities of the Model '" + Model.adapter.identity + "'");
            } else {
                L.err(TAG, "Trying to update all entities of the Model '" + Model.adapter.identity + "' without setting options.updateAll to true");
                return cb(ERR);
            }
        }
    },

    putOne: function(Model, query, fields, options, cb) {

        if (typeof(options) === "function") {
            cb = options;
            options = {};
        }

        if (typeof(query) === "object") {
            if (query.id) query = query.id;
            else {
                L.err(TAG, "if 'query' in putOne() is an object, it must contains an .id field");
                return cb(ERR);
            }
        }
        if (typeof(query) !== "string") {
            L.err(TAG, "'query' in putOne() must be an Object with .id or string containing the id of the entity to update");
            return cb(ERR);
        }

        query = { id: query };

        DB.put(Model, query, fields, options, function(err, res) {
            if (res && res[0]) res = res[0];
            else res = null;
            return cb(err, res);
        });
    },

    delete: function(Model, query, options, cb) {

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;

        delete query.deleted;

        //If query is null or not an object, set it to empty object (careful: typeof(null) === "object")
        if (_.isEmpty(query)) {

            if (options.deleteAll === true) {
                query = {};
                L.err(TAG, "Deleting (soft) all entities of the Model '" + Model.adapter.identity + "'");
            } else {
                L.err(TAG, "Trying to delete (soft) all entities of the Model '" + Model.adapter.identity + "' without setting options.deleteAll to true");
                return cb(ERR);
            }
        }

        Model.update(query, { deleted: true }).exec(function(err, result) {
            return doProjection(result, options, cb);
        });
    },

    hardDelete: function(Model, query, options, cb) {

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;

        //If query is null or not an object, set it to empty object (careful: typeof(null) === "object")
        if (_.isEmpty(query)) {

            if (options.deleteAll === true) {
                query = {};
                L.err(TAG, "Deleting (hard) all entities of the Model '" + Model.adapter.identity + "'");
            } else {
                L.err(TAG, "Trying to delete (hard) all entities of the Model '" + Model.adapter.identity + "' without setting options.deleteAll to true");
                return cb(ERR);
            }
        }

        Model.destroy(query).exec(function(err, result) {
            return doProjection(result, options, cb);
        });

    },

    findNativeMongoQuery: function(Model, query, options, cb) {

        //Check type of and parse fields from options
        var data = parseParameters(Model, query, options, cb);
        if (!data) return cb(ERR);
        query = data.query;
        options = data.options;
        cb = data.cb;

        Model.native(function(err, collection) {
            if (err) return cb(err);

            collection.find(query).sort(options.sort).toArray(function(err, result) {
                if (err) return cb(err);
                return doProjection(result, options, cb);
            });

        });
    },

    setLocation: function(obj_id, type, position, cb) {

        async.waterfall([

            function(cb) {
                DB.findOne(Location, { type: type, object: obj_id }, function(err, loc) {
                    return cb(err, loc);
                });
            },

            function(location, cb) {

                if (location) {
                    DB.updateOne(Location, location, { position: { type: "Point", coordinates: [position.longitude, position.latitude] } }, cb);
                } else {
                    Location.create({ object: obj_id, type: type, position: { type: "Point", coordinates: [position.longitude, position.latitude] } }).exec(cb);
                }
            }

        ], function(err, loc) {
            if (err || !loc) return cb(err);
            return cb(null, { latitude: loc.position.coordinates[1], longitude: loc.position.coordinates[0] });
        });

    },

    getByLocation: function(type, position, radius, options, cb) {

        var model;
        if (type.indexOf("user_") > -1) {
            type = type.split("_")[1];
            model = "user";
        } else {
            model = type;
        }

        var Model = sails.models[model];

        //Check type of and parse fields from options
        var data = parseParameters(Model, {}, options, cb);
        if (!data) return cb(ERR);
        options = data.options;
        cb = data.cb;

        Location.native(function(err, coll) {
            if (err) return cb(err);
            var q = {
                type: type,
                position: {
                    "$near": {
                        "$geometry": {
                            type: "Point",
                            coordinates: [position.longitude, position.latitude]
                        },
                        "$maxDistance": parseInt(radius) || 1000
                    },
                }
            };

            coll.find(q).toArray(function(err, locs) {
                if (err) return cb(err);

                var query = options.query || {};
                query.id = _.pluck(locs, "object");

                DB.find(Model, query, options, function(err, objects) {
                    if (err) return res.err(err);

                    var locsObjs = _.indexBy(locs, "object");

                    /*					_.each(locs, function(loc){
                    						locsObjs[loc.object] = loc;
                    					});*/

                    objects = _.filter(objects, function(obj) {
                        if (obj.deleted === true) return false;
                        obj.location = {
                            latitude: locsObjs[obj.id].position.coordinates[1],
                            longitude: locsObjs[obj.id].position.coordinates[0],
                        };
                        obj.location.distance = Math.round(getDistance(position, obj.location, "M"));
                        return true;
                    });

                    return cb(null, objects);

                });
            });
        });
    },

    getLocation: function(object, type, cb) {
        Location.findOne({ type: type, object: object.id }).exec(function(err, loc) {
            if (err) return cb(err);
            object.location = {
                latitude: loc.position[1],
                longitude: loc.position[0]
            };
            return cb(null, object);
        });
    },

    populate: function(Model, objects, populate, cb) {

        var pop;

        if (typeof(populate) === "function") {
            cb = populate;
            pop = { populateAll: true };
        } else {
            pop = { populate: populate };
        }
        var onlyOne = false;
        if (!Array.isArray(objects)) {
            objects = [objects];
            onlyOne = true;
        }

        var modelName;
        if (typeof(Model) === "string") {
            modelName = Model;
            Model = User;
        } else {
            modelName = Model.adapter.identity;
        }

        async.each(objects, function(obj, cb) {

            DB.get(Model, obj[modelName], pop, function(err, ent) {
                if (err) return cb(err);
                obj[modelName] = ent;
                return cb();
            });

        }, function(err) {
            if (onlyOne) return cb(err, objects[0]);
            return cb(err, objects);
        });

    },

};

//unit is optionnal, defaults to "K"
var getDistance = function(positionA, positionB, unit) {
    //Create a new note
    unit = unit || 'K';
    unit = unit.toUpperCase();
    if (["K", "N", "M"].indexOf(unit) === -1) {
        unit = "K";
    }

    var radlat1 = Math.PI * parseFloat(positionA.latitude) / 180;
    var radlat2 = Math.PI * parseFloat(positionB.latitude) / 180;

    var theta = parseFloat(positionA.longitude) - parseFloat(positionB.longitude);
    var radtheta = Math.PI * theta / 180;

    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;

    if (unit == "K") { dist = dist * 1.609344; }
    if (unit == "N") { dist = dist * 0.8684; }
    if (unit == "M") { dist = dist * 1609.344; }
    return dist;
};

var populateQuery = function(query, options) {

    //options.populate can be a string or an Array of string
    if (options.populate) {
        _.each(options.populate, function(value, key) {
            if (typeof(key) === "string") {
                value.deleted = { "!": true };
                query = query.populate(key, value);
            } else {
                query = query.populate(value, { deleted: { "!": true } });
            }
        });
    } else if (options.populateAll) {
        if (typeof(options.populateAll) === "object") {
            options.populateAll.deleted = { "!": true };
        } else {
            options.populateAll = { delete: { "!": true } };
        }
        query = query.populateAll(options.populateAll);
    }
};

//Do a field projection based on 'select' or 'unselect' option (delete all field not contained in select)
var doProjection = function(result, options, callback) {

    //return result if it's empty
    if (!result || _.isEmpty(result)) {
        return callback(null, result);
    }

    var onlyOne = false;
    if (!Array.isArray(result)) {
        onlyOne = true;
        result = [result];
    }

    //we'll keep/delete attributes from result and add it to newResult to return later
    var newResult = [];
    var locations = {};

    async.waterfall([

        function(cb) {
            if (!options.location) return cb();
            DB.find(Location, { type: options.location, object: _.pluck(result, "id") }, function(err, locs) {
                if (err) return cb(err);
                _.each(locs, function(loc) {
                    locations[loc.object] = loc;
                });
                return cb();
            });
        },

        function(cb) {

            _.each(result, function(entity) {

                //check the populated values and keep them if !populated or if the entity contains populated value(s)
                if (keepEntity(entity, options)) {

                    var keep;
                    if (options.keep) {
                        keep = entity;
                    }

                    //format the entity with the toJSON() function from the waterline model
                    entity = entity.toJSON();

                    if (keep) {
                        _.each(options.keep, function(k) {
                            entity[k] = keep[k];
                        });
                    }

                    //if there is no populate, the projection is made in the find query
                    if (options.populate) {
                        if (options.select) {
                            //remove the key from entity if it's not in the options.select Array
                            _.each(entity, function(value, key) {
                                if (key !== "id" && options.select.indexOf(key) === -1) {
                                    delete entity[key];
                                }
                            });
                        } else if (options.unselect) {
                            //remove the key from entity if it's in the options.unselect Array
                            _.each(options.unselect, function(unsel) {
                                delete entity[unsel];
                            });
                        }
                    }

                    if (options.location && locations[entity.id]) {
                        entity.location = {
                            latitude: locations[entity.id].position.coordinates[1],
                            longitude: locations[entity.id].position.coordinates[0],
                        };
                        //entity.location.distance = Math.round(getDistance(position, entity.location, "M"));
                    }

                    //Add entity if it has at least one {key:value}
                    if (!_.isEmpty(entity)) newResult.push(entity);
                }
            });

            if (onlyOne) {
                if (newResult.length) newResult = newResult[0];
                else newResult = null;
            }
            return cb(null, newResult);
        }
    ], callback);

};

//If populated is set to true, we remove all entities that does not have populated value
var keepEntity = function(entity, options) {
    if (!options.fields && (!options.populated || !options.populate)) return true;

    var keep = true;
    var checkOn = Array.isArray(options.populated) ? options.populated : options.populate;
    if (checkOn) {
        var isArray = Array.isArray(checkOn);
        _.each(checkOn, function(value, key) {
            var k = value;
            if (!isArray) k = key;

            if (!entity[k] || _.isEmpty(entity[k])) {
                keep = false;
            }
        });
    }

    if (options.fields) {
        _.each(options.fields, function(field) {
            if (entity[field] === null && entity[field] === undefined) {
                keep = false;
            }
        });
    }
    return keep;
};

var parseParameters = function(Model, query, options, cb) {

    //No options were passed, so cb takes its value and options are set to empty object
    if (typeof(options) === "function") {
        cb = options;
        options = {};
    } else if (!options) options = {};

    //if 'options' is sent back in this function, it won't be parse a second time 
    if (options.__parsed === true) {
        return { query: query, options: options, cb: cb };
    }

    if (!Model || !Model.adapter) {
        L.err(TAG, "'Model' is required and must be a Waterline Model");
        return false;
    }
    //If query is null or not an object, return false (careful: typeof(null) === "object")
    if (!query || typeof(query) !== "object") {
        //Make a query by id
        if (typeof(query) === "string") {
            query = { id: query };
        } else {
            L.err(TAG, "'query' must be an Object or a string (to query by id)");
            query = {};
        }
    }

    //populate, select and unselect are deleted if there aren't string or [string]
    if (options.populate && typeof(options.populate) === "string") options.populate = [options.populate];
    if (options.select && typeof(options.select) === "string") options.select = [options.select];
    if (options.unselect && typeof(options.unselect) === "string") options.unselect = [options.unselect];
    if (options.populated && typeof(options.populated) === "string") options.populated = [options.populated];
    if (options.fields && typeof(options.fields) === "string") options.fields = [options.fields];
    if (options.keep && typeof(options.keep) === "string") options.keep = [options.keep];

    //options.ppulate must be an Array or an Object
    if (options.populate && !(Array.isArray(options.populate) || typeof(options.populate) === "object")) {
        delete options.populate;
        L.err(TAG, "'options.populate' must be a string, a string Array or an Object");
    }
    if (options.select && !Array.isArray(options.select)) {
        delete options.select;
        L.err(TAG, "'options.select' must be a string or a string Array");
    }
    if (options.unselect && !Array.isArray(options.unselect)) {
        delete options.unselect;
        L.err(TAG, "'options.unselect' must be a string or a string Array");
    }
    if (options.populated && typeof(options.populated) !== "boolean" && !Array.isArray(options.populated)) {
        delete options.populated;
        L.err(TAG, "'options.populated' must be a boolean, a string or a string Array");
    }
    if (options.fields && !Array.isArray(options.fields)) {
        delete options.fields;
        L.err(TAG, "'options.fields' must be a string or a string Array");
    }
    if (options.keep && !Array.isArray(options.keep)) {
        delete options.keep;
        L.err(TAG, "'options.keep' must be a string or a string Array");
    }

    //Change the query to an 'OR' query : { or: [ {key1: value}, {key2: value} ] }
    if (options.or) {

        //If it's an arrray, we juste need to wrap it in {or: ..}
        if (Array.isArray(query)) {
            query = { or: query };
        }
        //If it's an object, change the query to an Array of objects
        else if (typeof(query) === "object") {
            var newQ = [];
            _.each(query, function(value, key) {
                var q = {};
                q[key] = value;
                newQ.push(q);
            });
            if (options.native === true)
                query = { "$or": newQ };
            else
                query = { or: newQ };
        } else {
            L.err(TAG, "'options.or' is true but the query is neither an Object or an Array");
        }
    }

    //don't return soft 'deleted' entities
    if (options.deletedOnly === true) {
        query.deleted = true;
    } else if (!options.deleted) {
        //entity does not have 'deleted' field by default, so we only check if entities have not been 'deleted'
        query.deleted = { "not": true };
    }

    //remove populate from array if it's not an existing populate field (either collection or model type in Model definition)
    if (options.native !== true && options.populate) {

        if (Array.isArray(options.populate)) {
            options.populate = _.filter(options.populate, function(pop) {
                if (pop === "location") {
                    options.location = Model.adapter.identity;
                    return false;
                }
                if (typeof(pop) !== "string" || !Model.attributes[pop] || !(Model.attributes[pop].collection || Model.attributes[pop].model)) {
                    L.err(TAG, "populate value '" + pop + "' is not a string or does not exist in Model:", Model.adapter.identity);
                    return false;
                }
                return true;
            });
            if (options.populate.length === 0) delete options.populate;
        } else {
            options.populate = _.pick(options.populate, function(value, key) {
                if (key === "location") {
                    options.location = Model.adapter.identity;
                    return false;
                }
                if (!Model.attributes[key] || !(Model.attributes[key].collection || Model.attributes[key].model)) {
                    L.err(TAG, "populate value '" + key + "' is not a string or does not exist in Model:", Model.adapter.identity);
                    return false;
                }
                return true;
            });
            if (_.isEmpty(options.populate)) delete options.populate;
        }
    } else {
        if (options.populate) {
            delete options.populate;
            L.err(TAG, "'options.populate' cannot be used when doing a native mongo query");
        }
    }

    //remove populated from array if it's not in populate array
    if (Array.isArray(options.populated)) {
        if (!options.populate) {
            L.err(TAG, "'options.populated' is set but 'options.populate' is undefined");
        } else {
            var popIsArray = Array.isArray(options.populate);
            options.populated = _.filter(options.populated, function(populated) {
                if (typeof(populated) !== "string" ||
                    (popIsArray && options.populate.indexOf(populated) === -1) ||
                    (!popIsArray && options.populate[populated] === undefined)) {
                    L.err(TAG, "'options.populated' contains a value ('" + populated + "') that is not a string or is not in 'options.populate'");
                    return false;
                }
                return true;
            });
        }
        if (options.populated.length === 0) delete options.populated;
    }

    //check that the Model contains these fields
    if (options.fields) {
        _.each(options.fields, function(field) {
            //Only keep fields that are string and attributes from the Model
            if (typeof(field) !== "string" || !Model.attributes[field]) {
                L.err(TAG, "'options.fields' contains unknown attribute : Model '" + Model.adapter.identity + "' has no field '" + field + "'");
                delete options.fields[field];
            }
        });
    }

    //Parse the select/unselect for the native mongo query ex: {name:1, first_name:1} || {name:0, first_name:0}
    if (options.native === true) {
        var newSel = {};

        if (options.select) {
            _.each(options.select, function(select) {
                if (typeof(select) === "string") {
                    newSel[select] = 1;
                } else L.err(TAG, "'options.select' contains element which is not of type string (type:", typeof(select), "value:", select + ")");
            });
            options.select = newSel;
        } else if (options.unselect) {
            _.each(options.unselect, function(unselect) {
                if (typeof(unselect) === "string") {
                    newSel[unselect] = 0;
                } else L.err(TAG, "'options.unselect' contains element which is not of type string (type:", typeof(unselect), "value:", unselect + ")");
            });
            delete options.select;
            options.select = newSel;
        }
    }

    // Model.find(query, select) actually works only on simple find (not findOne) without populate
    else if (!options.populate && options.unselect && !options.select) {
        options.select = [];
        _.each(Object.keys(Model.attributes), function(key) {
            if (options.unselect.indexOf(key) === -1) {
                options.select.push(key);
            }
        });
        delete options.unselect;
    }

    //Handle Limit
    handleLimitOption(options);

    //Handle Offset
    handleOffsetOption(options);

    //Handle Sort
    handleSortOption(options);

    options.__parsed = true;

    return { query: query, options: options, cb: cb };
};

var handleSortOption = function(options) {

    if (!options.sort) return;

    var typeOfSort = typeof(options.sort);

    if (Array.isArray(options.sort)) {

        var sorts = options.sort;
        options.sort = {};

        _.each(sorts, function(sort) {
            // options.sort must be an Array of strings
            parseSortString(sort, options);
        });
    } else if (typeOfSort === "object") {
        _.each(options.sort, function(value, key) {
            if (value !== 0 && value !== 1) {
                L.err(TAG, "options.sort object can only contain key:value pairs, with value === (0 || 1) (here:", key + ":" + value + ")");
                delete options.sort[key];
            }
        });
    } else if (typeOfSort === "string") {
        var sort = options.sort;
        options.sort = {};
        parseSortString(sort, options);
    }

    //If sort is not an array, object or string, it's not a valid option 
    else {
        L.err(TAG, "options.sort must be a string, a string Array, or an object");
        delete options.sort;
    }
};

var parseSortString = function(sort, options) {

    if (typeof(sort) !== "string") {
        L.err(TAG, "if options.sort is an Array, it must only contains strings (here: '" + sort + "' has a type of '" + typeof(sort) + "')");
        return;
    }

    sort = sort.toLowerCase();

    if (sort.indexOf(" asc") > -1) {
        options.sort[sort.split(" asc")[0]] = 1;
    } else if (sort.indexOf(" desc") > -1) {
        options.sort[sort.split(" desc")[0]] = 0;
    } else if (sort.indexOf(" ") === -1) {
        options.sort[sort] = 1;
    }

    //Sort fields cannot contains space if it's not followed by 'asc' or 'desc'
    else {
        L.err(TAG, "if options.sort is a string or a strings Array, the string cannot contain space, or the space must be followed either by 'asc' or 'desc' (['first_name', 'last_name desc'])", "(here: '" + sort + "')");
    }
};

var handleLimitOption = function(options) {
    if (options.limit === undefined || options.limit === null) {
        options.limit = DEF_LIMIT;
    } else if (isNaN(options.limit)) {
        options.limit = DEF_LIMIT;
        L.err(TAG, "'options.limit' must be of type number (type:", typeof(options.limit), ", value:", options.limit + ")");
    } else {
        if (options.limit > MAX_LIMIT) {
            options.limit = MAX_LIMIT;
            L.err(TAG, "'options.limit' cannot have a value above '" + MAX_LIMIT + "', (here:", options.limit + ")");
        } else if (options.limit < 0) {
            options.limit = DEF_LIMIT;
            L.err(TAG, "'options.limit' cannot be a negative number. It has been set to its default value :", DEF_LIMIT);
        }
    }
};

var handleOffsetOption = function(options) {
    if (options.offset) {
        if (isNaN(options.offset)) {
            L.err(TAG, "'options.offset' must be of type number (type:", typeof(options.offset), ", value:", options.offset + ")");
            delete options.offset;
        } else {
            if (options.offset < 0) {
                delete options.offset;
                L.err(TAG, "'options.offset' cannot be a negative number. It has been set to '0'");
            }
        }
    }
    //no offset when not set (===0)
    else delete options.offset;
};