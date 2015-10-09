import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';
import FontIcon from 'material-ui/lib/font-icon';
import RaisedButton from 'material-ui/lib/raised-button';

import { authenticate, oauth } from './firebase';
import store from './store';

class Login extends Component {
  constructor() {
    super();
  }

  render() {
    let action = (
      <RaisedButton label='Login with Facebook'
          key='login_submit_button'
          className='facebook-login'
          labelStyle={{
            color: 'white'
          }}
          onClick={this.onDialogSubmit.bind(this)} >
        <FontIcon className='facebook-icon' />
      </RaisedButton>
    );

    return (
      <Dialog ref='loginDialog'
        title='Login'
        actions={[action]}
        modal={true} />
    );
  }

  componentDidMount() {
    store.subscribe(() => {
      let state = store.getState();
      if (state.logged_in) {
        this.refs.loginDialog.dismiss();
        return;
      }
      this.refs.loginDialog.show();
    });
  }

  /**
   * @private
   */
  onDialogSubmit() {
    oauth();
  }
}

export default Login;
