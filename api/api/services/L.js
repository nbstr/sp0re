
// (silly, verbose,) info, debug, warn, error

// TODO use a special level to send notification ?
// ex: Log.support() => send mail with error message to support mail (from config)
// 
// TODO handle message as objects, with json stringify (in another file), with multiple messages, all from calling one api, wich is print at the end of the request (in http.js ?)
//  use req.session ? we need a session variable


//Use to write to Log :
//	log("message", level)
//	if no level, it use "info" level
//	there are synonyms for levels:
//	INFO: 	'3', 'i', 'info',
//	DEBUG: 	'2', 'd', 'debug', 'l', 'log'
//	WARN: 	'1', 'w', 'warn'
//	ERROR: 	'0', 'e', 'err', 'error'

/*
All possibilities :

	Log("error", 0);
	Log("error", "e");
	Log("error", "err");
	Log("error", "error");
	L.e("error");
	L.err("error");
	L.error("error");

	Log("warn", 1);
	Log("warn", "w");
	Log("warn", "warn");
	L.w("warn");
	L.warn("warn");

	Log("debug");
	Log("debug", 2);
	Log("debug", "d");
	Log("debug", "l");
	Log("debug", "log");
	Log("debug", "debug");
	L.d("debug");
	L.l("debug");
	L.log("debug");
	L.debug("debug");

	Log("info", 3);
	Log("info", "i");
	Log("info", "info");
	L.i("info");
	L.info("info");
	
 */

global.Log = function(msg, level){
	if (level === undefined || level === null) {
		return sails.log(msg);
	}

	switch (level){
		case 3:
		case "info":
		case "i": return sails.log.info(msg);

		case 2:
		case "l":
		case "log":
		case "debug":
		case "d": return sails.log.debug(msg);

		case 1:
		case "warn":
		case "w": return sails.log.warn(msg);

		case 0:
		case "error":
		case "err":
		case "e": return sails.log.error(msg);
	}

	sails.log.warn("[LOG] Unkown Log level :", level);
	sails.log.warn("[LOG] Message was :", msg);
};

global.log = Log;

//With Capital 'L' :
//	INFO: 	L.i("message")
//		 	L.info("message")
//	DEBUG: 	L.d("message")
//		 	L.l("message")
//		 	L.log("message")
//	WARN: 	L.w("message")
//	ERROR: 	L.e("message")
//	
module.exports = {
	
	//arguments contains all args received in a function
	//It's an Array like but it does not contain prebuild function (.join, .push, .pop...)

	//INFO
	i: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.info(message);
	},
	
	//INFO
	info: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.info(message);
	},

	//DEBUG
	d: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.debug(message);
	},		
	
	//DEBUG
	debug: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.debug(message);
	},	

	//DEBUG
	l: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.debug(message);
	},

	//DEBUG
	log: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.debug(message);
	},
	
	//WARN
	w: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.warn(message);
	},
	
	//WARN
	warn: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.warn(message);
	},

	//ERROR
	e: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.error(message);
	},

	//ERROR
	err: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.error(message);
	},

	//ERROR
	error: function(){
		var message = Array.prototype.join.call(arguments, " ");
		sails.log.error(message);
	},

};
