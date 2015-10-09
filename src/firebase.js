import ActionTypes from './ActionTypes';
import store from './store';

window.firebase = new Firebase('https://auctioneer.firebaseio.com/');
const initListeners = () => {
  firebase.on('value', function(snapshot) {
    store.dispatch({
      type: ActionTypes.FIREBASE_UPDATE,
      firebase_atom: snapshot.val()
    });
  });
};

firebase.onAuth((authData) => {
  if (authData) {
    initListeners();
    store.dispatch({
      type: ActionTypes.LOGGED_IN,
      email: authData.facebook.email,
      username: authData.facebook.displayName
    });
  } else {
    store.dispatch({
      type: ActionTypes.LOGGED_OUT
    });
  }
});

export const oauth = function() {
  firebase.authWithOAuthPopup('facebook', function() {}, {
    scope: 'email'
  });
};

export default firebase;
