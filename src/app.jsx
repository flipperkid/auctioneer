import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import lightTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';
import Admin from './Admin.jsx';
import Login from './Login.jsx';

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

class Root extends React.Component {
  render() {
    return (
      <div>
        <Admin />
        <Login />
      </div>
    );
  }

  getChildContext() {
    return {
        muiTheme: ThemeManager.getMuiTheme(lightTheme)
    };
  }
}

Root.childContextTypes = {
  muiTheme: React.PropTypes.object
}

React.render(<Root />, document.getElementById('app'));
