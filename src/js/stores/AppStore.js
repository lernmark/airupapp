/*
AppStore lyssnar på meddelanden från dispatchern
*/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _cards = {};

/**
 * Create a CARD item.
 * @param  {coords} text The long/lat of the CARD Map item
 */
function create(coords, text) {

  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _cards[id] = {
    id: id,
    coords: coords,
    text: text
  };
}

var AppStore = assign({}, EventEmitter.prototype, {

  getAll: function() {
    console.log("GETALL", _cards);
    return _cards;
    // return [{
    //   coords:"59.311758,18.066317",
    //   text:"Hornstull"
    // }];
  },
  emitChange: function() {
    console.log("Emit",this);
    this.emit(CHANGE_EVENT);
  }
});

// Lyssna på dispatchern
AppDispatcher.register(function(payload){
  console.log("PAYLOAD 2",payload);
  switch(payload.actionType) {
    case AppConstants.ADD_MAP:
      coords = payload.coords.trim();
      text = payload.text.trim();
      if (coords !== '') {
        create(coords, text);
        AppStore.emitChange();
      }
      break;
  }
  //return true;
});

module.exports = AppStore;
