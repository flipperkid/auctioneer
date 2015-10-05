import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import TextField from 'material-ui/lib/text-field';

import { authenticate } from './firebase';
import store from './store';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      indicatorState: 'hide',
      errorText: undefined
    };
  }

  render() {
    let standardActions = [
      <RaisedButton label='Submit'
        key='login_submit_button'
        secondary={true}
        onClick={this.onDialogSubmit.bind(this)} />
    ];

    return (
      <Dialog ref='loginDialog'
        title='Login'
        actions={standardActions}
        modal={true}
        openImmediately={true}>
        <div className='left-column'>
          <TextField ref='usernameInput'
            hintText='Username' /><br />
          <TextField ref='passwordInput'
            hintText='Password'
            type='password'
            errorText={this.state.errorText}
            onEnterKeyDown={this.onDialogSubmit.bind(this)} />
        </div>
        <div className='right-column'>
          <RefreshIndicator ref='loadingIndicator'
            size={40} left={0} top={50}
            style={{
              'position': 'relative'
            }}
            status={this.state.indicatorState} />
        </div>
      </Dialog>
    );
  }

  componentDidMount() {
    store.subscribe(() => {
      let state = store.getState();
      if (state.logged_in) {
        this.refs.loginDialog.dismiss();
        return;
      }

      if(state.login_error) {
        this.setState({
          indicatorState: 'hide',
          errorText: 'Invalid username or password'
        });
      };
    });
  }

  /**
   * @private
   */
  onDialogSubmit() {
    this.setState({
      indicatorState: 'loading',
      errorText: undefined
    });
    let username = this.refs.usernameInput.getValue();
    let password = this.refs.passwordInput.getValue();
    authenticate(username, password);
  }
}

export default Login;
