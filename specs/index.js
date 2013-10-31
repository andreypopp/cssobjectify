var browserify = require('browserify'),
    assert = require('assert'),
    vm = require('vm'),
    path = require('path'),
    cssobjectify = require('../index');

function fixture(name) {
  return path.join(__dirname, name);
}

function bundle(name, cb) {
  var filename = fixture(name);
  browserify()
    .require(filename, {expose: name})
    .transform(cssobjectify)
    .bundle(function(err, bundle) {
      if (err) return cb(err);
      var sandbox = {};
      try {
        vm.runInNewContext(bundle, sandbox);
      } catch (err) {
        return cb(err);
      }
      cb(null, sandbox);
    });
}

describe('cssobjectify', function() {
  it('transforms stylesheets into JSON objects', function(done) {
    bundle('styles.css', function(err, bundle) {
      if (err) return done(err);
      var styles = bundle.require('styles.css');
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      });
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: 'red',
        display: 'none'
      });
      done();
    });
  });

  it('transforms stylesheets into JSON objects (as a dependency)', function(done) {
    bundle('app.js', function(err, bundle) {
      if (err) return done(err);
      var styles = bundle.require('app.js');
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      });
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: 'red',
        display: 'none'
      });
      done();
    });
  });
});
