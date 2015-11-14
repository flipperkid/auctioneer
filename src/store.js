import { createStore } from 'redux';

import ActionTypes from './ActionTypes';

const initialState = {
  logged_in: false,
  username: 'Guest',
  email: '',
  uid: '',
  admin_mode: false,
  is_admin: false,
  firebase_atom: {
    items: {},
    bids: {}
  },
  temp_items: {}
};
const reducer = (state = initialState, action) => {
  let newState = $.extend(true, {}, state);
  switch (action.type) {
    case ActionTypes.LOGGED_IN:
      newState.logged_in = true;
      newState.username = action.username;
      newState.email = action.email;
      newState.uid = action.uid;
      return newState;
    case ActionTypes.LOGGED_OUT:
      return $.extend(true, {}, initialState);
    case ActionTypes.TOGGLE_ADMIN:
      newState.admin_mode = !newState.admin_mode;
      return newState;
      case ActionTypes.FIREBASE_UPDATE:
        newState.firebase_atom = action.firebase_atom;
        newState.firebase_atom.items = newState.firebase_atom.items || {};
        newState.firebase_atom.bids = newState.firebase_atom.bids || {};
        return newState;
    case ActionTypes.UPDATE_ITEM:
      let item = newState.temp_items[action.id];
      let newItem = $.extend(true, item, action.item);
      newState.temp_items[action.id] = newItem;
      return newState;
    case ActionTypes.ENABLE_ADMIN:
      newState.is_admin = true;
      return newState;
    default:
      return state;
  }
};

const store = createStore(reducer);
export default store;
