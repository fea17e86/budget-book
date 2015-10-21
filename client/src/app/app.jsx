import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute } from 'react-router';


//
// React Resources
// - https://facebook.github.io/react/docs/tutorial.html
// - https://facebook.github.io/react/docs/reusable-components.html
// - https://facebook.github.io/react/docs/top-level-api.html
//
// Alternativen zu JSX
// - https://github.com/mlmorg/react-hyperscript
//
// ES6 + React -- sehr lesenswert
// - http://babeljs.io/blog/2015/06/07/react-on-es6-plus/
//
// Future of React
// - https://quip.com/uJQeABv7nkFN
//
// Flow: Static Typing in JavaScript
// - :( not yet on Windows => https://github.com/facebook/flow/issues/6
// - http://flowtype.org/
//
// Immutable.js
// - https://facebook.github.io/immutable-js/
//

class App extends React.Component {
  render() {
    return (
      <div><h3>Bufget Book</h3></div>
    );
  }
}

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
    </Route>
  </Router>
), document.getElementById('app'));
