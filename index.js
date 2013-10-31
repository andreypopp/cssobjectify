"use strict";

var parse = require('css-parse'),
    toCamelCase = require('to-camel-case'),
    through = require('through');

var isCSS = /\.(css|styl|sass|scss|less)$/;

module.exports = function(filename) {
  if (!isCSS.exec(filename)) return through();

  var buf = '';
  return through(
    function(chunk) { buf += chunk; },
    function() {
      var tree, modExports = {};
      try {
        tree = parse(buf);
      } catch(err) {
        return this.emit('error', 'error parsing ' + filename + ': ' + err);
      }
      tree.stylesheet.rules.forEach(function(rule) {
        rule.selectors.forEach(function(selector) {
          var styles = (modExports[selector] = modExports[selector] || {});
          rule.declarations.forEach(function(declaration) {
            styles[toCamelCase(declaration.property)] = declaration.value;
          });
        });
      });
      this.queue('module.exports = ' + JSON.stringify(modExports) + ';');
      this.queue(null);
    });
}
