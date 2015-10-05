import ActionTypes from './ActionTypes';
import store from './store';

window.firebase = new Firebase('https://auctioneer.firebaseio.com/');
firebase.unauth();

export const authenticate = function(username, password) {
  var state = store.getState();
  firebase.authWithPassword({
    email: username + '@gmail.com',
    password: password
  }, function(error, authData) {
    if (error) {
      store.dispatch({
        type: ActionTypes.LOGIN_ERROR
      })
    } else {
      initListeners();
      store.dispatch({
        type: ActionTypes.LOGGED_IN
      });
    }
  });
};

const initListeners = function() {
  firebase.on('value', function(snapshot) {
    store.dispatch({
      type: ActionTypes.FIREBASE_UPDATE,
      firebase_atom: snapshot.val()
    });
  });
};

export default firebase;
