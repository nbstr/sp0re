
module.exports = {
	
	attributes: {

		position:{
			type: "JSON",
			required: "true"
		},

		object: {
			type: "STRING",
			required: true
		},

		//model name which is at that location
		type: {
			type: "STRING",
			required: true
		}

	}

}