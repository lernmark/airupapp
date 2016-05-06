/** @jsx React.DOM */

// var Header = require('./Header');
var Navigation = require('./Navigation');
var MainSection = require('./MainSection');
var React = require('react');
var AppActions = require('../actions/AppActions');
var AppStore = require('../stores/AppStore');


function showError() {
  console.log("Show error");
  $(".mdl-progress").hide();
  return {
    formError:true
  };
}

function getAppState() {
  return {
    allCards: AppStore.getAll()
  };
}

var Airupapp = React.createClass({

  getInitialState: function() {
    //TODO: Här bör min nuvarande location beräknas. Inte i Card
    AppActions.insertInfoCard("The air, Where I live, What is it like?", "");
    return getAppState();
  },

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
    AppStore.addErrorListener(this._onError);
  },
  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
    AppStore.removeErrorListener(this._onError);
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
    this.setState(getAppState());
  },
  _onError: function() {
    this.setState(showError());
    console.log("Current State: ", this.state);
  }

});

module.exports = Airupapp;
