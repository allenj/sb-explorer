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
        }
    });

    // load tasks
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // setup work flow
    grunt.registerTask("default", ["jshint"]);
};