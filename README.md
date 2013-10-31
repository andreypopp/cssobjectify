# cssobjectify

Source transform for [browserify][browserify] or [dcompose][dcompose] which
converts CSS into JSON objects which can be used further by libraries like
[React][React] to assign styles to UI components.

`styles.css`:

    MyComponent {
      font-size: 12px;
      background-color: red;
    }

`myapp.js`:

    var React = require('react-tools/build/modules/React');
    var Styles = require('./styles.css');

    var MyComponent = React.createClass({
      render: function() {
        return (
          <div style={Styles.MyComponent}>
            Hello, world!
          </div>
        )
      }
    });

## Usage

Use npm to install the package:

    % npm install cssobjectify

And use it with browserify:

    % browserify -t cssobjectify ./myapp.js

where `./myapp.js` or its dependencies can reference `*.css` files by
`require(...)` calls.

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[React]: http://facebook.github.io/react/
