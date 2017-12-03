/**
 * Connections
 * (sails.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `sails-mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 * Note: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 * (this is to prevent you inadvertently sensitive credentials up to your repository.)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

var name = JSON.parse(require('fs').readFileSync('./package.json')).name.toLowerCase();

var CONNECTION_URIS = {
	dev: "mongodb://localhost:21989/sp0re",
	prod: "mongodb://heyadmin:ec]gI2[4jdif9cod#3fUnIb>=qj8tith@127.0.0.1:21989/sp0re?authSource=test"
};

module.exports.connections = {

	mongoDB: {
		adapter: 'sails-mongo',
		url: CONNECTION_URIS[(process.env.NODE_ENV === "production" ? "prod" : "dev")],

		// url: 'mongodb://localhost:21989/hey-backend',
		// url: 'mongodb://heyadmin:ec]gI2[4jdif9cod#3fUnIb>=qj8tith@127.0.0.1:21989/hey-backend?authSource=test',
		// url: 'mongodb://nabster:Ytzx4ePERbiSSLfN@hey-shard-00-00-s4s9d.mongodb.net:27017,hey-shard-00-01-s4s9d.mongodb.net:27017,hey-shard-00-02-s4s9d.mongodb.net:27017/hey?ssl=true&replicaSet=hey-shard-0&authSource=admin',
	}

};