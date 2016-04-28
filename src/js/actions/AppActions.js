/*
AppAction används för att hantera event och skicka dem till dispatcher
*/

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var AppActions = {

  /**
   * @param  {string} text
   */
  removeCard: function(title) {
    console.log("AppAction: removeCard. Lets dispatch it: ", title);
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_CARD,
      title: title,
    });
  },

  insertMapCard: function(title, text, coords) {
    console.log("AppAction: insertMapCard. Lets dispatch it: ", title, text, coords);
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_MAP,
      coords: coords,
      title: title,
      text: text
    });
  },
  /**
   * @param  {string} text
   */
  insertInfoCard: function(title, text) {
    console.log("AppAction: insertInfoCard. Lets dispatch it: ", title, text);
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_INFO,
      title: title,
      text: text
    });
  }

}

module.exports = AppActions
