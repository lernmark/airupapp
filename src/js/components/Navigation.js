/** @jsx React.DOM */

var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


var Navigation = React.createClass({
  /**
   * @return {object}
   */

   handleClick:function(link, e){
     if (link.type === "map") {
       AppActions.insertMapCard(link.title, link.test, link.position);
     } else {
       AppActions.insertInfoCard(link.title, link.text);
     }
     //AppActions.insertMapCard('59.315219,18.034122', 'Hornstull, Stockholm')
     //AppActions.insertMapCard('59.313215,18.081075', 'SOFO, Stockholm')
     //AppActions.insertMapCard('52.481409,13.434372', 'Neukölln, Berlin')
   },
  render: function() {
    var allLinks = [
      {"title":"Airup, what is it?", "type":"info", "text":"Z Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
      {"title":"Färgfabriken", "type":"map", "position":"59.314924,18.019890", "text":""},
      {"title":"Hornstull", "type":"map", "position":"59.315219,18.034122", "text":""},
      {"title":"SOFO, Stockholm", "type":"map", "position":"59.313215,18.081075", "text":""},
      {"title":"Neukölln, Berlin", "type":"map", "position":"52.481409,13.434372", "text":""}
    ];
    var links = [];
    for (var key in allLinks) {
      var title = allLinks[key].title;
      links.push(<a className="mdl-navigation__link" onClick={this.handleClick.bind(this, allLinks[key])} target="_blank">{title}</a>);
    }

  	return (
      <div className="mdl-layout__drawer">
        <h5 className="mdl-layout-title">About Airup</h5>
        <nav className="mdl-navigation" id="airup-navigation">
          {links}
        </nav>
      </div>
    );
  },


});

module.exports = Navigation;
