/** @jsx React.DOM */

/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/AppActions');
var Card = require('./Card');
// var TodoItem = require('./TodoItem.react');

var MainSection = React.createClass({

  propTypes: {
    allCards: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    console.log("MainSection: render this.props.allCards", this.props.allCards)
    // This section should be hidden by default
    // and shown when there are todos.
    if (Object.keys(this.props.allCards).length < 1) {
      //return null;
    }

    var allCards = this.props.allCards;
    var cards = [];

    for (var key in allCards) {
      console.log("MainSection: card", allCards[key]);
      cards.unshift(<Card key={key} card={allCards[key]} />);
    }
    return (
      <div>{cards}</div>
    );
  },

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll: function() {
    //TodoActions.toggleCompleteAll();
  }

});

module.exports = MainSection;
