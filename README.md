# grunt-anyreplace

> Replace text in files using strings, regular expressions or functions.I used to replace references from non-optimized scripts, stylesheets and other assets to their optimized version within a set of HTML files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-anyreplace --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-anyreplace');
```

## The "anyreplace" task

### Overview
In your project's Gruntfile, add a section named `anyreplace` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  anyreplace: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.timestamp
Type: `Boolean`
Default value: `false`

Whether to preserve the timestamp attributes(atime and mtime) when replaceing files. Set to true to preserve files timestamp. But timestamp will not be preserved when the file contents or name are changed during replaceing.

#### options.replacements

*replacements* is an array of *from* and *to* replacements. See the
[examples](#usage) above.


### from

*from* is the old text that you'd like replace. It can be a:

- plain string: `'.css'` *matches all instances of '.min.css' in file*
- regular expression object:  `/\.css/g` *same as above*


### to

*to* is the replacement. It can be a:

- plain string
- string containing a [grunt.template][grunt.template]
- string containing regex variables `$1`, `$2`, etc
- combination of the above
- function where the return value will be used as the replacement text (supports
[grunt.template][grunt.template])
- any JavaScript object


#### function
Where *to* is a function, the function receives 4 parameters:

1. **matchedWord**:  the matched word
2. **index**:  an integer representing point where word was found in a text
3. **fullText**:  the full original text
4. **regexMatches**:  an array containing all regex matches, empty if none
defined or found.


```javascript
// Where the original source file text is:  "Hello world"

replacements: [{
  from: /wor(ld)/g,
  to: function (matchedWord, index, fullText, regexMatches) {
    // matchedWord:  "world"
    // index:  6
    // fullText:  "Hello world"
    // regexMatches:  ["ld"]
    return 'planet';   //
  }
}]

// The new text will now be:  "Hello planet"
```

### Usage Examples

#### Replace the '.css' to '.min.css' in HTML
In this example,replaces references from non-optimized scripts, stylesheets and other assets to their optimized version within a set of HTML files`

```js
grunt.initConfig({
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
});
```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
