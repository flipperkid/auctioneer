import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import FlatButton from 'material-ui/lib/flat-button';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import ActionTypes from './ActionTypes';
import ItemColumn from './ItemColumn.jsx';
import firebase from './firebase';
import store from './store';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      items: {},
      bids: {},
      adminMode: false,
      email: '',
      username: 'Guest'
    };
    this.date = null;
    this.time = null;
  }

  render() {
    let windowWidth = $(window).width();
    let columnCount = 2;
    if (windowWidth < 850) {
      columnCount = 1;
    }

    let itemSplit = [];
    let itemColumns = [];
    for (var columnIdx = 0; columnIdx < columnCount; columnIdx++) {
      var items = {};
      itemSplit.push(items);
      itemColumns.push(<ItemColumn key={columnIdx} items={items}
        bids={this.state.bids}
        adminMode={this.state.adminMode}
        username={this.state.username}
        email={this.state.email}
        uid={this.state.uid}
        closeDate={this.state.closeDate}
        columnCount={columnCount} />);
    }

    let itemsAdded = 0;
    Object.keys(this.state.items).forEach((key) => {
      var item = this.state.items[key];
      if (item.archived || (!item.is_published && !this.state.adminMode)) {
        return;
      }

      var columnIdx = itemsAdded++ % columnCount;
      itemSplit[columnIdx][key] = item;
    });

    let rightElement = (<FlatButton label='Logout' onClick={this.logout} />);
    let title = 'Auction';
    if (this.state.closeDate) {
      var date = new Date(this.state.closeDate);
      let timeParts = date.toLocaleTimeString().split(' ');
      let ampm = '';
      if (timeParts.length > 1 && (timeParts[1] === 'AM' || timeParts[1] === 'PM')) {
        ampm = ' ' + timeParts[1];
      }
      title += ' open until ' + date.toDateString() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ampm;
    }

    let pickerClass = 'hidden';
    if (this.state.adminMode) {
      title += ' (Admin)';
      pickerClass = '';
      rightElement = (
        <IconMenu iconButtonElement={
          <IconButton><ExpandMoreIcon color='white' /></IconButton>
        }>
          <MenuItem primaryText='New Item' onClick={this.addNewItem} />
          <MenuItem primaryText='Set Auction Close Date'
            onClick={this.setAuctionClose.bind(this)} />
          <MenuItem primaryText='Logout' onClick={this.logout} />
        </IconMenu>
      );
    }

    return (
      <div>
        <AppBar
          title={title}
          showMenuIconButton={this.state.isAdmin || false}
          onLeftIconButtonTouchTap={this.toggleAdmin}
          iconElementRight={rightElement} />
        <div className='row' >
          {itemColumns}
        </div>
        <DatePicker ref='dateInput'
          hintText='Close Date'
          className={pickerClass}
          mode='portrait'
          onChange={this.updateCloseDate.bind(this)}
          onDismiss={this.finishDateUpdate.bind(this)} />
        <TimePicker ref='timeInput'
          hintText='Close Time'
          className={pickerClass}
          pedantic={true}
          onChange={this.updateCloseTime.bind(this)}
          onDismiss={this.finishTimeUpdate.bind(this)} />
      </div>
    );
  }

  componentDidMount() {
    store.subscribe(() => {
      let state = store.getState();
      let firebaseAtom = state.firebase_atom;
      let bids = firebaseAtom.bids;
      let tempItem = state.temp_items;
      let items = {};
      Object.keys(firebaseAtom.items).forEach((key) => {
        items[key] = $.extend(true, firebaseAtom.items[key], tempItem[key]);
      });
      this.setState({
        items: items,
        bids: bids,
        adminMode: state.admin_mode,
        username: state.username,
        email: state.email,
        isAdmin: state.is_admin,
        uid: state.uid,
        closeDate: firebaseAtom.close_date
      });
    });
  }

  /**
   * @private
   */
  addNewItem() {
    firebase.child('app_data/items').push({
      starting_bid: 5,
    }, function(result) {
      if (result instanceof Error) {
        throw result;
      }
    });
  }

  /**
   * @private
   */
  logout() {
    firebase.unauth();
  }

  /**
   * @private
   */
  toggleAdmin() {
    store.dispatch({
      type: ActionTypes.TOGGLE_ADMIN
    });
  }

  /**
   * @private
   */
  setAuctionClose() {
    this.refs.dateInput.openDialog();
  }

  /**
   * @private
   */
  updateCloseDate(nill, date) {
    this.date = date;
  }

  /**
   * @private
   */
  updateCloseTime(nill, time) {
    this.time = time;
  }

  /**
   * @private
   */
  finishDateUpdate() {
    this.refs.timeInput.refs.dialogWindow.show();
  }

  /**
   * @private
   */
  finishTimeUpdate() {
    setTimeout(() => {
      if (this.date === null || this.time === null) {
        return;
      }

      // yikes
      let date = this.date.getTime();
      let time = this.time.getTime()
      this.date = null;
      this.time = null;
      let datePartOfTime = Math.floor(new Date().getTime() / (1000*60*60*24)) * (1000*60*60*24);
      let dateWithoutTime = Math.floor(date / (1000*60*60*24)) * (1000*60*60*24);
      let datetime = dateWithoutTime + time - datePartOfTime;
      firebase.child('app_data').update({
        close_date: datetime
      }, (result) => {
        if (result instanceof Error) {
          throw result;
        }
      });
    });
  }
}

export default Admin;
