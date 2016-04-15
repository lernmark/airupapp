/** @jsx React.DOM */

// var Header = require('./Header');
var Navigation = require('./Navigation');
var MainSection = require('./MainSection');
var CardMap = require('./CardMap');
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


function getAppState() {
  return {
    allCards: AppStore.getAll()
  };
}

function getCards() {
  return {
    //allCards: AppStore.getAll()
    allCards: {
      coords:"59.311758,18.066317",
      text:"Hornstull"
    }
  };
}

var Airupapp = React.createClass({

  getInitialState: function() {
    //TODO: Här bör min nuvarande location beräknas. Inte i CardMap
    AppActions.insertMapCard('59.002,18.444', 'Hornstull2');
    return getAppState();
  },

  componentDidMount: function() {
    // Load initial card.
    //AppActions.insertMapCard('59.002,18.444', 'Hornstull');
  },
  render: function() {

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header" >
          <header className="mdl-layout__header mdl-layout__header--waterfall">
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">
                  Airup
                </span>
              <div className="mdl-layout-spacer"></div>
            </div>
          </header>
          <Navigation />

          <main className="mdl-layout__content" id="airup-map">
          <MainSection allCards={this.state.allCards} />
          </main>
      </div>
      )
  },

  _onChange: function() {
    this.setState({
      allCards:{}
    });
  }

});

module.exports = Airupapp;
