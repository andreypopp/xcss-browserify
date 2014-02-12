var fs          = require('fs');
var mktemp      = require('mktemp');
var path        = require('path');
var spawn       = require('child_process').spawn;
var assert      = require('assert');
var browserify  = require('browserify');
var xcssPlugin  = require('../index');
var aggregate   = require('stream-aggregate');

var entry = path.join(__dirname, 'entry.js');

describe('xcss-browserify', function() {

  it('works via command line', function(done) {
    var bundle = mktemp.createFileSync('xcss-browserify-XXXX');
    var p = spawn('node', [
      require.resolve('browserify/bin/cmd.js'),
      '-p', '[', require.resolve('../index'), '-o', bundle, ']',
      entry,
    ]);
    p.stderr.pipe(process.stderr);
    p.on('close', function(code) {
      assert.equal(code, 0);
      var result = fs.readFileSync(bundle, 'utf-8');
      assert.ok(result.indexOf('body {') > -1);
      fs.unlinkSync(bundle);
      done();
    });
  });

  it('works via API', function(done) {
    var latch = 2;

    function maybeDone() {
      latch -= 1;
      if (latch === 0) done();
    }

    var b = browserify(entry).plugin(xcssPlugin);
    var s = b.bundle();

    aggregate(s, function(err, result) {
      if (err) return done(err);
      maybeDone();
    });

    aggregate(s.css, function(err, result) {
      if (err) return done(err);
      assert.ok(result);
      assert.ok(result.indexOf('body {') > -1);
      maybeDone();
    });
  });

});
