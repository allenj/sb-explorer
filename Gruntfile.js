module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            options: {
                eqeqeq: true,
                trailing: true
            },
            target: {
                src: ['app/js/**/*.js']
            }
        },
        concat: {
            options: {
                stripBannners: true
            },
            dist: {
                src: ['app/js/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                report: 'min'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        karma: {
            options: {
                configFile: 'config/karma.conf.js'
            },
            dist: {
                singleRun: true
            }
        },
        watch: {
            karma: {
                files: ['app/js/**/*.js', 'app/*.html'],
                tasks: ['karma:unit:run', 'jshint']
            }
        },
        clean: {
            dev: ['dev'],
            dist: ['dist']
        },
        copy: {
            dev: {
                files: [
                    {expand: true, cwd: "app/", src: '**', dest: 'dev/'}
                ]
            },
            dist: {
                files: [
                    {expand: true, cwd: "app/", src: '**', dest: 'dist/'}
                ]
            }
        },
        combine: {
            dev: {
                input: 'dev/js/services.js',
                output: 'dev/js/services.js',
                tokens: [
                    {
                        token: "@@hostname@@",
                        string: "https://beta.sciencebase.gov"
                    }
                ]
            },
            dist: {
                input: 'dist/js/services.js',
                output: 'dist/js/services.js',
                tokens: [
                    {
                        token: "@@hostname@@",
                        string: "https://www.sciencebase.gov"
                    }
                ]
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-combine");
    grunt.loadNpmTasks("grunt-karma");

    // setup work flow
    grunt.registerTask("default", ["jshint"]);
    grunt.registerTask("build", ["jshint", "karma:dist", "clean:dist", "copy:dist", "combine:dist"]);
    grunt.registerTask("build-dev", ["jshint", "clean:dev", "copy:dev", "combine:dev"])
};