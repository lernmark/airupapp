/*
AppStore lyssnar på meddelanden från dispatchern
*/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var ERROR_EVENT = 'error';
var _cards = {};

/**
 * Create a CARD item.
 * @param  {coords} text The long/lat of the CARD Map item
 */
function createMap(coords, title,  text) {
  //var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _cards[coords] = {
    id: coords,
    type: "map",
    title:title,
    coords: coords,
    text: text
  };
}

/**
 * Create a CARD item.
 * @param  {coords} text The long/lat of the CARD Map item
 */
function createInfo(title, text) {
  //var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _cards[title] = {
    id: title,
    type: "info",
    title: title,
    text: text
  };
}

function removeCard(title) {
  delete _cards[title];
}

var AppStore = assign({}, EventEmitter.prototype, {

  getAll: function() {
    return _cards;
    // return [{
    //   coords:"59.311758,18.066317",
    //   text:"Hornstull"
    // }];
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  emitError: function() {
    this.emit(ERROR_EVENT);
  },
  /**
   * @param {function} callback
   */
   addChangeListener: function(callback) {
     this.on(CHANGE_EVENT, callback);
   },

   addErrorListener: function(callback) {
     this.on(ERROR_EVENT, callback);
   },

    /**
    * @param {function} callback
    */
   removeChangeListener: function(callback) {
     this.removeListener(CHANGE_EVENT, callback);
   },
    /**
    * @param {function} callback
    */
   removeErrorListener: function(callback) {
     this.removeListener(ERROR_EVENT, callback);
   }
});

// Lyssna på dispatchern
AppDispatcher.register(function(payload){
  switch(payload.actionType) {
    case AppConstants.SAVE_SIGNUP:

      $(".mdl-progress").show();
      $.post( "/signup", payload.formData).done(function( data ) {
        $(".mdl-progress").hide();
        $("#form-ok").show();
        AppStore.emitChange();
      }).fail(function() {
        console.log( "error" );
        AppStore.emitError();
      });
      break;
    case AppConstants.REMOVE_CARD:
      var title = payload.title;
      if (title !== '') {
        removeCard(title);
        AppStore.emitChange();
      }
      break;
    case AppConstants.ADD_MAP:
      var coords = payload.coords;
      var title = payload.title;
      var text = payload.text;
      if (coords !== '') {
        createMap(coords, title, text);
        AppStore.emitChange();
      }
      break;
    case AppConstants.ADD_INFO:
      var title = payload.title;
      var text = payload.text;
      if (title !== '') {
        createInfo(title, text);
        AppStore.emitChange();
      }
      break;
  }
  //return true;
});

module.exports = AppStore;
