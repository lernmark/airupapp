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
    AppDispatcher.dispatch({
      actionType: AppConstants.REMOVE_CARD,
      title: title,
    });
  },

  insertMapCard: function(title, text, coords) {
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
    AppDispatcher.dispatch({
      actionType: AppConstants.ADD_INFO,
      title: title,
      text: text
    });
  },

  submitSignup: function(formData) {
    AppDispatcher.dispatch({
      actionType: AppConstants.SAVE_SIGNUP,
      formData: formData
    });
  }

}

module.exports = AppActions
