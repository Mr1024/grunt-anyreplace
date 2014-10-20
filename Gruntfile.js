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
                        from: /(<link.*href=['"].*)(?!\.min)(?=\.css)/g,
                        to: '$1.min'
                    }]
                },
                files: [{
                    expand: true,
                    cwd: 'test/source/',
                    src: ['**/*.html'],
                    dest: 'test/build/'
                }]
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');
    // By default, lint and run all tests.
    grunt.registerTask('default', ['anyreplace']);

};
