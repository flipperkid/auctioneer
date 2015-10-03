import { compose, createStore } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import ActionTypes from './ActionTypes';

const initialState = {
  description: ''
};
const reducer = function(state = initialState, action) {
  var newState = $.extend(true, {}, state);
  switch (action.type) {
    case ActionTypes.SET_DESCRIPTION:
      newState.description = '';
      return newState;
    default:
      return state;
  }
};

const finalCreateStore = compose(
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);
const store = finalCreateStore(reducer);
export default store;
