# xcss-browserify

This package is used by [xCSS][1] to provide plugin for browserify. You probably
wouldn't want to use it directly but rather via xCSS itself.

Since 3.28.0 version browserify has a new feature called [plugins][bp]. This
allows you to run xcss along with browserify and extract references to
stylesheets from your code, so you can write:

    require('./styles.xcss');

    ...

and have `./styles.xcss` bundled in a resulted stylesheet bundle.

## Installation

Install via npm:

    % npm install xcss

## Using from command line

The command-line usage of browserify + xcss looks like:

    browserify -p [ xcss -o ./bundle.css ] -o ./bundle.js ./index.js

After running this you will have `bundle.js` and `bundle.css` created in the
directory.

## Using programmatically

If you use browserify programmatically, then usage is as follows:

    var fs = require('fs')
    var browserify = require('browserify')
    var xcss = require('xcss')

    var b = browserify('./index.js').plugin(xcss)
    var stream = b.bundle()
    stream.pipe(fs.createWriteStream('bundle.js'))
    stream.css.pipe(fs.createWriteStream('bundle.css'))

As you can see, there's `stream.css` stream which you can pipe to the
destination.

[1]: https://github.com/andreypopp/xcss
[bp]: https://github.com/substack/node-browserify#plugins
