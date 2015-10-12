/** @jsx React.DOM */

var React = require('react');

module.exports = HelloWorld = React.createClass({
  getInitilaState: function () {
    return { name: 'Peter' };
  },

  render: function () {
    return <h4>Hello { this.props.name }!</h4>;
  }
});
