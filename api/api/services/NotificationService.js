
var TAG = "[PushNotifService]";
var PusherService = require("sails-service-pusher");
//var SMSService = require("sails-service-sms");

var initiate_ios_pusher = function(){
	var provider = {
		cert: __dirname+'/../../certificates/ios/heed_live.pem', // The filename of the connection certificate to load from disk
		key: __dirname+'/../../certificates/ios/heed_private_key.pem', // The filename of the connection key to load from disk
		passphrase: 'heed', // The passphrase for the connection key
		production: true // Specifies which environment to connect to: Production (if true) or Sandbox
	};
	return PusherService('ios',{provider:provider});
};

var initiate_android_pusher = function(){
	var provider = {
		apiKey: 'AIzaSyA7w8VmAblhbF2RP5if5tZ6KW5-JAOnYj8'
	};
	return PusherService('android',{provider:provider});
};

var initiate_sms_pusher = function(){
	return SMSService('twilio', {
			sender: '+32460202160',	
  			provider: {
    			accountSid: 'ACddd9326f3f71ea9b18d20be09d893449',
    			authToken: '931cd0fb9aee2c6c002d1eb410c4843b'
  			}
	});
};

var ios_pusher = initiate_ios_pusher();
var android_pusher = initiate_android_pusher();
//var sms_pusher = initiate_sms_pusher();

var NOTIF_TYPES = require('../../config/locales/notifications.json');
var getText = function (data, code, language){
	if (!NOTIF_TYPES[code]) {
		L.err(TAG, "The code '" + code + "' does not exists in notification types");
		return null;
	}
	if (!NOTIF_TYPES[code][language]) {
		L.err(TAG, "The language '" + language + "' for the code '" + code + "' does not exist in notification types");
		language = "en";
	
		if (!NOTIF_TYPES[code][language]) {
			L.err(TAG, "The language '" + language + "' for the code '" + code + "' does not exist in notification types");
			return null;
		}
	}

	var value = NOTIF_TYPES[code][language];
	if (data) {
		for (var k in data) {
			value = value.replace(':'+k, data[k]);
		}
	}
	return value;
};

module.exports = {

	sendNotif: function(data, code, users){

		if (!users || !users.length) return;

		//Check that users is an array 
		if (!Array.isArray(users)) users = [users];

		//Group users by language
		var groups = {fr:[], en:[], nl:[]};

		_.each(users, function(user){
			if (user.settings && user.settings.device_token && user.settings.device_type){
				var user_lang = (user.settings && user.settings.language ? user.settings.language : 'fr').toLowerCase();
				if (groups[user_lang]){
					groups[user_lang].push(user);
				}
			}
		});

		//Iterate each language and send notif to the corresponding user
		_.each(groups, function(users, lang){
			if (users.length){
				_sendNotif(data, code, lang, users);
			}
		});

	},
	
	sendSMSNotif: function (data, code, users_phone){

		if (!users_phone ||!users_phone.length) return;

		sails.log(TAG_NOTIF, "[SMS] data:", data, "/ to:", users_phone.join(", "));

		//TODO get language of the users
		var text = getText(data, "", "en");

		sms_pusher.send({
    		recipient: users_phone,
    		message: text
  		})
  		.then(function(res){ sails.log(TAG_NOTIF, "SMS then:", res ); })
  		.catch(function(err){ sails.log.error(TAG_NOTIF, "SMS error:", err); });
  		 
	},

};


var _sendNotif = function (data, code, lang, users){

	var text = getText(data, code, lang);
	var message = {title:text, body:text};

	var ios_tokens = [], android_tokens = [];

	_.each(users, function(user){
		if (user.settings.device_type.toLowerCase() == 'ios')
			ios_tokens.push(user.settings.device_token);
		else if (user.settings.device_type.toLowerCase() == 'android')
			android_tokens.push(user.settings.device_token);
	});

	sails.log(TAG_NOTIF, "[  iOS  ] code:", code + ", lang:", lang + ", to:", ios_tokens.join(", "));
	sails.log(TAG_NOTIF, "[Android] code:", code + ", lang:", lang + ", to:", android_tokens.join(", "));

	// Send the notification
	if (ios_tokens.length){
		try {
			ios_pusher.send(ios_tokens, message)
				.then(function (res){
					sails.log(TAG_NOTIF, 'ios then', res);
				})
  				.catch(function (err){
  					sails.log.error(TAG_NOTIF, err);
  				});
  		}
  		catch(err){
  			sails.log.error(TAG_NOTIF, "error sending ios notif", err);
  		}
	}
	if (android_tokens.length){
		try {
			android_pusher.send(android_tokens, message)
				.then(function (res){
					sails.log(TAG_NOTIF, 'Android then', res);
				})
  				.catch(function (err){
  					sails.log.error(TAG_NOTIF, err);
  				});
  		}
  		catch(err){
  			sails.log.error(TAG_NOTIF, "error sending android notif", err);
  		}
	}

};