/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


var Navigation = React.createClass({
  /**
   * @return {object}
   */

   handleClick:function(){
     AppActions.insertMapCard('59.002,18.444', 'Hornstull');
   },
  render: function() {

  	return (
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">About Airup</span>
          <nav className="mdl-navigation" id="airup-navigation">

          <a className="mdl-navigation__link" href="//airup.me" target="_blank">airup.me</a>
          <a className="mdl-navigation__link" onClick={this.handleClick} href="">Hornstull</a>

          </nav>
      </div>
    );
  },


});

module.exports = Navigation;
