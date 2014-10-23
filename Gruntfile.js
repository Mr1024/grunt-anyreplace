/*
 * grunt-anyreplace
 * https://github.com/Mr1024/grunt-anyreplace
 *
 * Copyright (c) 2014 Mr1024
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        anyreplace: {
            js: {
                options: {
                    timestamp: true,
                    replacements: [{
                        from: /(<script\b.*?src=(['"]?))((?:(?!\.min)[^'"\s>])+)(?=\.js\2)/g,
                        to: '$1$3.min'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'test/source/',
                    src: ['**/*.html'],
                    dest: 'test/build/js/'
                }]
            },
            css: {
                options: {
                    timestamp: true,
                    replacements: [{
                        from: /(<link\b.*?href=(['"]?))((?:(?!\.min)[^'"\s>])+)(?=\.css\2)/g,
                        to: '$1$3.min'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'test/source/',
                    src: ['**/*.html'],
                    dest: 'test/build/css/'
                }]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'anyreplace', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
