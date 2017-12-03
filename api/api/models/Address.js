
module.exports = {
	
	attributes: {

		user: {
			model: "User"
		},

	    street: {
	    	type: 'STRING',
	    	required: true
	    },

	    num: 'STRING',
	    box: 'STRING',
	    postcode: 'STRING',
	    city: 'STRING',
	    country: 'STRING',

        /* Location is in GeoJSON format :
            {
                type: "Point",
                coordinates: ["longitude","latitude"]
            }
        */
        location: {
            type: "JSON",
           	noUpdate: true
        },

	},

	afterUpdate: function(val, cb){
		removeOlder(cb);
	},
	afterCreate: function(val, cb){
		removeOlder(cb);
	},


};

//When an object update its own address, a new one is created and the foreign key ("user") of the older one is set to null => we erase that address
//TODO/WARNING: If another model is linked to this model, it needs to be added after user:null (ie, if pet can also have an address : destroy({user:null, pet:null})... ),
//otherwhise it will ERASE ALL addresses !!
var removeOlder = function(cb){
	Address.destroy({
		user:null
	}).exec(function(err, res){
		cb();
	});
};