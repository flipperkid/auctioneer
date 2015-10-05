import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Admin from './Admin.jsx';
import Login from './Login.jsx';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

class Root extends Component {
  render() {
    return (
      <div>
        <Admin />
        <Login />
      </div>
    );
  }
}

React.render(<Root />, document.body);
