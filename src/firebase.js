import ActionTypes from './ActionTypes';
import store from './store';

const firebase = new Firebase('https://auctioneer.firebaseio.com/');
firebase.unauth();

export const authenticate = function() {
  var state = store.getState();
  firebase.authWithPassword({
    email: state.name,
    password: state.text
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      initListeners();
    }
  });
};

const initListeners = function() {
  firebase.on('child_added', function(snapshot) {
    store.dispatch({
      type: ActionTypes.RECEIVE_MESSAGE,
      message: snapshot.val()
    });
  });
};

export default firebase;
