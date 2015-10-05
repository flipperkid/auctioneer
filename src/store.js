import { createStore } from 'redux';

import ActionTypes from './ActionTypes';

const initialState = {
  logged_in: false,
  login_error: false,
  open_new: false,
  open_item: null,
  firebase_atom: {
    items: {}
  }
};
const reducer = function(state = initialState, action) {
  var newState = $.extend(true, {}, state);
  switch (action.type) {
    case ActionTypes.FIREBASE_UPDATE:
      newState.firebase_atom = action.firebase_atom;
      if (newState.open_new) {
        newState.open_new = false;
        Object.keys(newState.firebase_atom.items).forEach(function(key) {
          if (state.firebase_atom.items[key] === undefined) {
            newState.open_item = key;
          }
        });
      }
      return newState;
    case ActionTypes.LOGGED_IN:
      newState.logged_in = true;
      return newState;
    case ActionTypes.LOGIN_ERROR:
      newState.login_error = true;
      return newState;
    case ActionTypes.OPEN_NEW:
      newState.open_new = true;
      return newState;
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;
