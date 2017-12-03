var fs = require('fs');
var PICTURE_FOLDER = "pictures/";
var TAG = "[ImageService]";
var same_file = false;

module.exports = {

    /*
    	folderName is optionnal (it's the folder where the file will be saved : '/pictures/folderName/filename.ext')
    	paramName is optionnal (it's the name of the 'file' parameter send to the server)
    */
    uploadServer: function(req, folderName, paramName, cb) {

        if (sails.config.params.upload_on_aws === true) {
            L.error(TAG, "Upload on AWS is not possible right now");
            return cb("db_error");
        }

        //Handle optionnal folderName and paramName
        if (typeof(folderName) === "function") {
            cb = folderName;
            folderName = "";
            paramName = "file";
        } else if (typeof(paramName) === "function") {
            cb = paramName;
            paramName = "file";
        }
        if (folderName !== "" && folderName.indexOf("/") === -1 && !same_file) {
            folderName += "/";
        }

        try {
            var file = req.file(paramName);

            file.upload({ dirname: __dirname + '/../../assets/' + PICTURE_FOLDER + folderName }, function onUploadComplete(err, files) {

                if (err) return cb(err);
                if (!files[0]) return cb("no_file");

                //TODO Use first line for Windows, second line otherwise
                //var filename = files[0].fd.split('\\').reverse()[0];
                var filename = files[0].fd.split('/').reverse()[0];

                //Files needs to be copied in .tmp/uploads
                var __path = PICTURE_FOLDER + folderName + ((same_file) ? '.jpg' : filename);
                fs.createReadStream(files[0].fd).pipe(fs.createWriteStream(__dirname + '/../../.tmp/public/' + __path));

                var filepath = sails.config.server_url + __path;

                return cb(null, filepath);
            });

        } catch (e) {
            L.error(TAG, "Image upload uncaught error | user:", req.session.user, "| err:", e);
            return cb(e);
        }

    }

};