module.exports = function(grunt) {

	//This file must not be present when deploying on AWS because when grunt init the config at the server launch, this fais and throws error (read credentials..)
	//files:src -> '!tasks/config/aws.js'
	
	var pkg = grunt.file.readJSON('./package.json');
	pkg.name = pkg.name.toLowerCase();
	archivePath = "../" + pkg.name + "_" + pkg.version + ".zip";

	var accessKey,
		accessKeySecret;
	try {
		var creds = grunt.file.read(process.env.HOME + '/.aws/credentials').split('\r\n');
		accessKey = creds[1].split("=")[1].trim();
		accessKeySecret = creds[2].split("=")[1].trim();
	} catch (e) {
		console.log("No credentials file for AWS : ~/.aws/credentials");
	}

	grunt.config.set('compress', {

		main: {
			options: {
				archive: archivePath,
				mode: 'zip'
			},

			files: [{
				expand: true,
				dot: true,
				src: ['**/*', '!node_modules/**', '!**/*.zip', '!tasks/config/aws.js', '!.git/**', '!.tmp/**'],
				cwd: './'
			}]
		}
	});

	grunt.config.set('awsebtdeploy', {

		main: {
			options: {
				applicationName: pkg.name,
				environmentName: pkg.name,
				sourceBundle: archivePath,
				accessKeyId: accessKey,
				secretAccessKey: accessKeySecret,
				region: "eu-central-1",
				//versionLabel: pkg.name + "_" + pkg.version,
				//deployType: "inPlace",
				s3: {
					bucket: pkg.name + "-code",
					key: pkg.name + "_" + pkg.version + ".zip"
				}
			}
		},
	});


	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-awsebtdeploy');

	grunt.registerTask('aws', [
		'compress:main',
		'awsebtdeploy:main'
	]);

};