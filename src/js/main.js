/** @jsx React.DOM */
var React = require('react');

// Not ideal to use createFactory, but don't know how to use JSX to solve this
// Posted question at: https://gist.github.com/sebmarkbage/ae327f2eda03bf165261
var Airupapp = require('./components/Airupapp.js');

React.render(
  <Airupapp />,
  document.getElementById('airup-map')
);


// React.render(
//   <MsbFeed source="//crossorigin.me/http://api.krisinformation.se/v1/feed?format=json" />,
//   document.getElementById('msb-list')
// );
