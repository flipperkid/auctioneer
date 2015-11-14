import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';

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
      itemColumns.push(<ItemColumn items={items}
        bids={this.state.bids}
        adminMode={this.state.adminMode}
        username={this.state.username}
        email={this.state.email}
        columnCount={columnCount} />);
    }

    let itemsAdded = 0;
    Object.keys(this.state.items).forEach((key) => {
      var item = this.state.items[key];
      if (!item.is_published && !this.state.adminMode) {
        return;
      }

      var columnIdx = itemsAdded++ % columnCount;
      itemSplit[columnIdx][key] = item;
    });

    let rightElement = (<FlatButton label='Logout' onClick={this.logout} />);
    let title = 'Auctioneer';
    if (this.state.adminMode) {
      title += ' (Admin)'
      rightElement = (<FlatButton label='New Item' onClick={this.addNewItem} />);
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
        isAdmin: state.is_admin
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
}

export default Admin;
