/** @jsx React.DOM */

// var Header = require('./Header');
var Navigation = require('./Navigation');
var MainSection = require('./MainSection');
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


function getAppState() {
  return {
    allCards: AppStore.getAll()
  };
}

var Airupapp = React.createClass({

  getInitialState: function() {
    //TODO: Här bör min nuvarande location beräknas. Inte i Card
    AppActions.insertInfoCard("data", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
    return getAppState();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
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
    console.log("Airupapp: Now we will change....",this);
    this.setState(getAppState());
  }

});

module.exports = Airupapp;
