
- social network connections
- upload pic
- file handler s3 or not/ grunt
- mail provider : sendgrid...
- localisation generic (type, geoloc)
- permission users (penser loin) file with user group/ definir certain comportement
- caching (npm module)


TODO before use
===============

- config/session.js : Change secret string ?  
- npm install `Will install : bcrypt / randomstring / sails-hook-email / winston + winston-daily-rotate-file / sails / sails-mongo / sails-hook-autoreload / connect-mongo (it needs version 0.8.* for the sessions to work)`  
- Change name and version in package.json (the given name will be used for DB name, log file and eventually AWS service)
- Add "auth" and "email from" in config/emails.js to send email (already done for reset password, but it's disabled by default, open it in config/policies.js)
- Modify view/emailTemplates/resetPassword/html.ejs to change LOGO add the EMAIL & NAME on lines 17-18 

One-To-One Model:
=================
```
//Model Obj
module.exports = {

	attributes: {

		anotherObj: {
			collection: "anotherObj",
			via: "obj",
		},

		toJSON: function(){
			var obj = this.toObject();
			if (obj.anotherObj) // anotherObj is a nested One-to-one relation
				obj.anotherObj = obj.anotherObj[0];
			return obj;
		}

	},

	afterUpdate : function(values, cb){
		AnotherObj.destroy({obj:null}).exec(function(){
			return cb();			
		});
	}
};
```

Custom property in Models
=========================
> The attribute "field" cannot be updated through an API (with the ModelService.parse() )  

```
module.exports = 
	attributes: {
        field: {
            type: 'STRING',
            //Custom attribute, the ModelService won't parse this value (user cannot update its type through request)
            //This needs the function types:noUpdates() below
            noUpdate: true
        },
    },
    types: {
        noUpdate: function(){
            return true;
        }
    },
}
```

# upgrade node
http://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version