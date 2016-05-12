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

    var allCards = this.props.allCards;
    var cards = [];

    for (var key in allCards) {
      cards.unshift(<Card key={key} card={allCards[key]} />);
      //cards.push(<Card key={key} card={allCards[key]} />);
    }
    return (
      <div>{cards}</div>
    );
  },


});

module.exports = MainSection;
