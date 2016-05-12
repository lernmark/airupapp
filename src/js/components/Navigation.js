/** @jsx React.DOM */
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');

var Navigation = React.createClass({
  /**
   * @return {object}
   */

   handleClick:function(link, e){
     $("#form-ok").hide();
     var layout = document.querySelector('.mdl-layout');
     layout.MaterialLayout.toggleDrawer();
     if (link.type === "map") {

       AppActions.insertMapCard(link.title, link.test, link.position);
       AppActions.insertInfoCard("What is the air quality like where I live?", "");
     } else {
       AppActions.insertInfoCard(link.title, link.text);
     }
     //AppActions.insertMapCard('59.315219,18.034122', 'Hornstull, Stockholm')
     //AppActions.insertMapCard('59.313215,18.081075', 'SOFO, Stockholm')
     //AppActions.insertMapCard('52.481409,13.434372', 'Neukölln, Berlin')
   },
  render: function() {
    var allLinks = [
      //{"title":"What is the air quality like where I live?", "type":"info", "text":""},
      {"title":"Färgfabriken", "type":"map", "position":"59.314924,18.019890", "text":""},
      {"title":"Hornstull", "type":"map", "position":"59.315219,18.034122", "text":""},
      {"title":"Fredhäll", "type":"map", "position":"59.328909,18.002429", "text":""},
      {"title":"SOFO, Stockholm", "type":"map", "position":"59.313215,18.081075", "text":""},
      {"title":"Frogner, Oslo", "type":"map", "position":"59.917155,10.703945", "text":""},
      {"title":"Neukölln, Berlin", "type":"map", "position":"52.481409,13.434372", "text":""},
      {"title":"Sternschanze, Hamburg", "type":"map", "position":"53.561577,9.962239", "text":""},
      {"title":"Retiro, Madrid", "type":"map", "position":"40.421078,-3.685817", "text":""}
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
