/*
AppAction används för att hantera event och skicka dem till dispatcher
*/

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {string} text
   */
  insertMapCard: function(coords, text) {
    console.log("add map", coords, text);
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_MAP,
      coords: coords,
      text: text
    });
  },

  addItem: function(item){
    console.log("add item");
    AppDispatcher.handleViewAction({
      actionType:AppConstants.ADD_ITEM,
      item: item
    })
  }
}

module.exports = AppActions
