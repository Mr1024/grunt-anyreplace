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
        anyreplace: {
            css: {
                options: {
                    timestamp: true,
                    replacements: [{
                        from: '.css',
                        to: '.min.css'
                    }]
                },
                src: ['test/source/*.html'],
                dest: 'test/build/'
                    //files: [{
                    //    expand: true,
                    // cwd: 'build/',
                    // src: ['**/
                    // * .html '],
                    // dest: 'build'
                    // }]
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    // By default, lint and run all tests.
    grunt.registerTask('default', ['anyreplace']);

};
