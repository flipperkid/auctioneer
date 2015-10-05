import React, { Component } from 'react';
import AppBar from 'material-ui/lib/app-bar';
import FlatButton from 'material-ui/lib/flat-button';

import ActionTypes from './ActionTypes';
import Item from './Item.jsx';
import firebase from './firebase';
import store from './store';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      items: {},
      openItem: null
    };
  }

  render() {
    var indexToOpen = -1;
    if (this.state.openItem === null) {
      indexToOpen = 0;
    }
    var index = 0;
    var items = Object.keys(this.state.items).map((key) => {
      var item = this.state.items[key];
      return (
        <Item key={key}
          itemId={key}
          title={item.title}
          description={item.description}
          startingBid={item.starting_bid ? item.starting_bid : 0}
          isPublished={item.is_published}
          isOpen={index++ === indexToOpen || this.state.openItem === key} />)
    });

    return (
      <div>
        <AppBar
          title='Admin Tool'
          showMenuIconButton={false}
          iconElementRight={<FlatButton label='New Item' onClick={this.addNewItem} />} />
        {items}
      </div>
    );
  }

  componentDidMount() {
    store.subscribe(() => {
      let state = store.getState();
      let firebaseAtom = state.firebase_atom
      this.setState({
        items: firebaseAtom.items,
        openItem: state.open_item
      });
    });
  }

  /**
   * @private
   */
  addNewItem() {
    store.dispatch({
      type: ActionTypes.OPEN_NEW
    });
    firebase.child('items').push({
      starting_bid: 5,
    });
  }
}

export default Admin;
