/*
 * grunt-anyreplace
 * https://github.com/Mr1024/grunt-anyreplace
 *
 * Copyright (c) 2014 Mr1024
 * Licensed under the MIT license.
 */

'use strict';
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
module.exports = function(grunt) {
    grunt.registerMultiTask('anyreplace', 'Replace text in files using strings, regular expressions or functions.I used to replace references from non-optimized scripts, stylesheets and other assets to their optimized version within a set of HTML files.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            encoding: grunt.file.defaultEncoding,
            timestamp: false,
            mode: false
        });

        var copyOptions = {
            encoding: options.encoding,
            process: function(text) {
                return replaceTextMultiple(text, options.replacements);
            }
        };

        var dest;
        var isExpandedPair;
        var dirs = {};
        // Iterate over all specified file groups.
        this.files.forEach(function(filePair) {
            isExpandedPair = filePair.orig.expand || false;
            if (filePair.src.length == 0) {
                grunt.log.warn('Source file not found because src files were empty.');
            }
            filePair.src.forEach(function(src) {
                if (detectDestType(filePair.dest) === 'directory') {
                    dest = (isExpandedPair) ? filePair.dest : unixifyPath(path.join(filePair.dest, src));
                } else {
                    dest = filePair.dest;
                }
                if (grunt.file.isDir(src)) {
                    grunt.file.mkdir(dest);
                    if (options.timestamp) {
                        dirs[dest] = src;
                    }
                } else {
                    grunt.file.copy(src, dest, copyOptions);
                    syncTimestamp(src, dest);
                    if (options.mode !== false) {
                        fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
                    }
                }
            });
        });
        if (options.timestamp) {
            Object.keys(dirs).sort(function(a, b) {
                return b.length - a.length;
            }).forEach(function(dest) {
                syncTimestamp(dirs[dest], dest);
            });
        }
        /*
         * detect destination's type
         */
        function detectDestType(dest) {
            if (grunt.util._.endsWith(dest, '/') || grunt.file.isDir(dest)) {
                return 'directory';
            } else {
                return 'file';
            }
        };

        function unixifyPath(filepath) {
            if (process.platform === 'win32') {
                return filepath.replace(/\\/g, '/');
            } else {
                return filepath;
            }
        };

        function md5(src) {
            var md5Hash = crypto.createHash('md5');
            md5Hash.update(fs.readFileSync(src));
            return md5Hash.digest('hex');
        };

        function syncTimestamp(src, dest) {
            var stat = fs.lstatSync(src);
            if (path.basename(src) !== path.basename(dest)) {
                return;
            }
            if (stat.isFile() && md5(src) !== md5(dest)) {
                return;
            }
            fs.utimesSync(dest, stat.atime, stat.mtime);
        };

        function replaceTextMultiple(text, replacements) {
            return replacements.reduce(function(newText, replacement) {
                return replaceText({
                    text: newText,
                    from: replacement.from,
                    to: replacement.to
                });
            }, text);
        };

        function replaceText(settings) {
            var text = settings.text;
            var from = convertPatternToRegex(settings.from);
            console.log(from);
            var to = expandReplacement(settings.to);
            console.log(text.replace(from, to));
            return text.replace(from, to);
        };

        function convertPatternToRegex(pattern) {
            var regexCharacters = '\\[](){}^$-.*+?|,/';
            if (typeof pattern === 'string') {
                regexCharacters.split('').forEach(function(character) {
                    var characterAsRegex = new RegExp('(\\' + character + ')', 'g');
                    pattern = pattern.replace(characterAsRegex, '\\$1');
                });
                pattern = new RegExp(pattern, 'g');
            }
            return pattern;
        };

        function expandReplacement(replacement) {
            if (typeof replacement === 'function') {
                return expandFunctionReplacement(replacement);
            } else if (typeof replacement === 'string') {
                return expandStringReplacement(replacement);
            } else {
                return expandNonStringReplacement(replacement);
            }
        };

        function expandFunctionReplacement(replacement) {
            return function() {
                var matchedSubstring = arguments[0];
                var index = arguments[arguments.length - 2];
                var fullText = arguments[arguments.length - 1];
                var regexMatches = Array.prototype.slice.call(arguments, 1,
                    arguments.length - 2);
                var returnValue = replacement(matchedSubstring, index, fullText,
                    regexMatches);
                return (typeof returnValue === 'string') ? processGruntTemplate(returnValue) : expandNonStringReplacement(returnValue);
            };
        };

        function expandStringReplacement(replacement) {
            return processGruntTemplate(replacement);
        };

        function expandNonStringReplacement(replacement) {
            var isReplacementNullOrUndefined = (typeof replacement === 'undefined') || (replacement === null);
            return isReplacementNullOrUndefined ? '' : String(replacement);
        };

        function processGruntTemplate(string) {
            var isProcessTemplateTrue = true;
            if (grunt.task.current.data && grunt.task.current.data.options && typeof grunt.task.current.data.options.processTemplates !== 'undefined' && grunt.task.current.data.options.processTemplates === false) {
                isProcessTemplateTrue = false;
            }
            return isProcessTemplateTrue ? grunt.template.process(string) : string;
        };



    });
};
