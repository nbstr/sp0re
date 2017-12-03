module.exports = function(grunt) {

    var fs = require('fs');
    var aceBuilds = [];

    // maybe dont get ALL ace in here.. pretty heavy..
    var files = fs.readdirSync('bower_components/ace-builds/src-min-noconflict/');
    files.forEach(function(file) {
        aceBuilds.push('src-min-noconflict/' + file);
    });

    var files_snippets = fs.readdirSync('bower_components/ace-builds/src-min-noconflict/snippets/');
    files_snippets.forEach(function(file) {
        aceBuilds.push('src-min-noconflict/snippets/' + file);
    });

    // console.log('aceBuilds', aceBuilds);

    //util functions
    var build_src = "../build/";
    var bower_dependencies = {
        'underscore': 'jquery',
        'angular': 'jquery',
        'angular-animate': ['jquery', 'angular'],
        'angular-resource': ['jquery', 'angular'],
        'angular-ui-router': ['jquery', 'angular'],
        'angular-file-upload': ['jquery', 'angular'],
        'angular-ui-ace': ['jquery', 'angular'],
        'angular-timeago': ['jquery', 'angular'],
        'angular-dragdrop': ['jquery', 'angular'],
        'ace-builds': ['jquery', 'angular']
    };
    var bower_urls = {
        // 'ace-builds': aceBuilds,
        'ace-builds': ['src-min-noconflict/ace.js', 'src-min-noconflict/ext-language_tools.js'],
        'angular-ui-ace': 'ui-ace.min.js',
        'angular-cache': ['dist/angular-cache.js']
    };
    //Warning: exclude both css and js
    var bower_exclude = []

    //Other config
    var js_concat = [
        'app/util/prototype.js',
        //configs file
        'app/config/general.js',
        'app/config/*.js',
        //functions
        'app/util/functions.js',
        'app/util/**/*.js',
        'app/index.js',
        //all the other files
        'app/**/*.js',
        '!app/external/**/*.js',
        'app/app.js',
        'app/bootstrap.js',
        '!app/config_*.js'
    ];
    //Rest of the grunt file
    var util = {
        createConfigName: function(path, extension) {
            var names = path.split("/");
            var name = names[names.length - 1];
            var j = name.indexOf(".");
            name = name.substr(0, j);
            if (extension)
                return '"' + name + extension + '"';
            return '"' + name + '"'
        }
    }
    var grunt_config = {

        pkg: grunt.file.readJSON('package.json'),

        //cleaning
        clean: {
            options: {
                force: true
            },
            'build': [build_src],
            'release': [build_src + "css", build_src + "js"]
        },
        //pug
        pug: {
            compile: {
                //Important: use client false !
                options: {
                    client: false,
                    pretty: true
                },
                files: [
                    //states html files
                    {
                        cwd: './app',
                        src: "states/**/*.pug",
                        dest: build_src + "html",
                        ext: ".html",
                        expand: true,
                        flatten: true
                    },
                    //Widget html files
                    {
                        cwd: './app',
                        src: "widgets/**/*.pug",
                        dest: build_src + "html",
                        ext: ".html",
                        expand: true,
                        flatten: true
                    }
                ]
            },
            index_prod: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [{
                    cwd: './app',
                    src: 'index_prod.pug',
                    dest: build_src,
                    ext: ".html",
                    expand: true,
                    rename: function(dest, src) {
                        return build_src + "index.html";
                    }
                }]

            },
            index_dev: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [{
                    cwd: './app',
                    src: 'index_dev.pug',
                    dest: build_src,
                    ext: ".html",
                    expand: true,
                    rename: function(dest, src) {
                        return build_src + "index.html";
                    }
                }]
            }
        },
        //concat bower
        bower_concat: {
            all: {
                dest: {
                    "js": build_src + 'js/lib.js',
                    "css": build_src + 'css/lib.css'
                },
                dependencies: bower_dependencies,
                mainFiles: bower_urls,
                exclude: bower_exclude,
                bowerOptions: {
                    relative: false
                }
            }
        },
        //sass
        sass: { // Task
            dist: { // Target
                files: [{
                    src: ['app/index.scss'],
                    dest: build_src + 'css/main.css',
                }]
            }
        },
        //concat js
        concat: {
            options: {
                separator: ''
            },
            dev: {
                src: js_concat.concat(['app/config_dev.js']),
                dest: build_src + '/js/code.js',
            },
            prod: {
                src: js_concat.concat(['app/config_prod.js']),
                dest: build_src + '/js/code.js',
            }
        },
        //copy file
        copy: {
            //assets
            assets: {
                src: 'assets/**/*',
                dest: build_src
            },
            //data
            data: {
                expand: true,
                cwd: 'app/',
                src: 'data/**/*',
                dest: build_src
            },
            img_emoji: {
                expand: true,
                cwd: '',
                src: 'img/*',
                dest: build_src
            },
            ace_lib: {
                expand: true,
                cwd: '',
                src: 'ace-lib/**/*',
                dest: build_src
            },
            fonts: {
                src: 'fonts/**/*',
                dest: build_src
            },
            xml: {
                src: '*.xml',
                dest: build_src
            },
            external: {
                expand: true,
                cwd: 'app/',
                src: 'external/**/*',
                dest: build_src
            },
            state_html: {
                cwd: 'app/',
                src: ["states/**/*.html",  '!states/templates/*.html'],
                dest: build_src + "html",
                expand: true,
                flatten: true
            },
            widget_html: {
                cwd: 'app/',
                src: "widgets/**/*.html",
                dest: build_src + "html",
                expand: true,
                flatten: true
            },
            html: {
                cwd: 'app/',
                src: ['*.html'],
                expand: true,
                dest: build_src
            },
            templates: {
                cwd: 'app/states/templates',
                src: '*.html',
                expand: true,
                dest: build_src + 'templates'
            },
            php: {
                src: '*.php',
                dest: build_src
            },
            img: {
                src: ['*.png', '*.jpg', '*.jpeg', '*.giff'],
                dest: build_src
            }
            //other could come here
        },
        //CSS autoprefixer
        autoprefixer: {
            no_dest: {
                src: build_src + 'css/main.css' // globbing is also possible here
            }
        },
        //CSS minification
        cssmin: {
            options: {
                sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: build_src + 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: build_src + "dist",
                    ext: '.min.css'
                }]
            }
        },
        //create server
        connect: {
            options: {
                port: process.env.PORT || 3131,
                base: build_src,
            },

            all: {},
        },
        //watch everything
        watch: {
            options: {
                livereload: true
            },
            //normal html
            html: {
                files: 'app/**/*.pug',
                tasks: ['pug']
            },
            //copy 
            state_html: {
                files: 'app/states/**/*.html',
                tasks: ['copy']
            },
            widgets_html: {
                files: 'app/widgets/**/*.html',
                tasks: ['copy']
            },
            json: {
                files: ['app/**/*.json'],
                tasks: ['copy']
            },
            assets: {
                files: ['assets/**/*'],
                tasks: ['copy']
            },
            //create auto injections
            components: {
                files: ['app/components/**/*'],
                tasks: ['file-creator']
            },
            widgets: {
                files: ['app/widgets/**/*'],
                tasks: ['file-creator']
            },
            //css
            css: {
                files: ['app/**/*.scss'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    livereload: false
                }
            },
            //specific
            index_dev: {
                files: 'app/index_dev.jade',
                tasks: ['jade:index_dev']
            },
            index_prod: {
                files: 'app/index_prod.jade',
                tasks: ['jade:index_prod']
            },
            dev: {
                files: 'app/**/*.js',
                tasks: ['concat:dev']
            },
            prod: {
                files: 'app/**/*.js',
                tasks: ['concat:prod']
            }
        },
        //inject css without reloading (only for dev)
        browserSync: {
            dev: {
                bsFiles: {
                    src: build_src + "css/main.css"
                },
                options: {
                    watchTask: true // < VERY important
                }
            }
        },
        //minify JS (/!\ need to change index.pug !!!)
        uglify: {
            options: {
                sourceMap: true
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: build_src + 'js/',
                    src: '*.js',
                    dest: build_src + 'dist/',
                    ext: ".min.js"
                }]
            }
        },
        "file-creator": {
            options: {
                openFlags: 'w'
            },
            components: {
                "app/config/components.js": function(fs, fd, done) {
                    var glob = grunt.file.glob;
                    var _ = grunt.util._;
                    glob('app/components/**/*.js', function(err, files) {
                        var components = [];
                        _.each(files, function(file) {
                            components.push(file);
                        });
                        //console.log(components);
                        fs.writeSync(fd, '// this file is auto-generated.  DO NOT MODIFY\nconfig.app.components=[');
                        _.each(components, function(file, i) {
                            //treatement module
                            var name = util.createConfigName(file, "Module", i);
                            if (i < components.length - 1)
                                name += ",";
                            fs.writeSync(fd, name);
                        });
                        fs.writeSync(fd, "];");
                        done();
                    });
                }
            },
            widgets: {
                "app/config/widgets.js": function(fs, fd, done) {
                    var glob = grunt.file.glob;
                    var _ = grunt.util._;
                    glob('app/widgets/**/*.js', function(err, files) {
                        var widgets = [];
                        _.each(files, function(file) {
                            widgets.push(file);
                        });
                        //console.log(widgets);
                        fs.writeSync(fd, '// this file is auto-generated.  DO NOT MODIFY\nconfig.app.widgets=[');
                        _.each(widgets, function(file, i) {
                            //treatement Widget
                            var name = util.createConfigName(file, "Widget", i);
                            if (i < widgets.length - 1)
                                name += ",";
                            fs.writeSync(fd, name);
                        });
                        fs.writeSync(fd, "];");
                        done();
                    });
                }
            },
        }
    };
    //Grunt config
    grunt.initConfig(grunt_config);

    grunt.registerTask('watch_dev', function() {
        delete grunt.config.data.watch.prod;
        delete grunt.config.data.watch.index_prod;

        grunt.task.run('watch');
    });

    grunt.registerTask('watch_prod', function() {
        delete grunt.config.data.watch.dev;
        delete grunt.config.data.watch.index_dev;

        grunt.task.run('watch');
    });

    //load deps
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', [
        'clean:build',
        'pug:compile',
        //lib
        'bower_concat',
        //js generator
        'file-creator',
        //copy files
        'copy',
        //css part
        'sass',
        'autoprefixer'
    ]);

    grunt.registerTask('dev', ['default', 'pug:index_dev', 'concat:dev', 'connect', 'browserSync', 'watch_dev']);

    grunt.registerTask('prod_dev', ['default', 'pug:index_dev', 'concat:prod', 'connect', 'browserSync', 'watch_prod']);

    //deploy here (watch only for testing (no editing))
    grunt.registerTask('prod', ['default', 'pug:index_prod', 'concat:prod', 'cssmin', 'uglify', 'clean:release', 'connect', 'watch_prod']);
};
