import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';

import firebase from './firebase';

class ItemAdmin extends Component {
  constructor() {
    super();
  }

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'Confirm', onClick: this.delete.bind(this) }
    ];
    return (
      <Dialog title='Confirm Delete?' ref='deleteDialog'
          actions={standardActions}
          modal={false} >
        Are you sure you want to delete this item?
      </Dialog>
    );
  }

  show() {
    this.refs.deleteDialog.show();
  }

  /**
   * @private
   */
  delete() {
    firebase.child('items/'+this.props.itemId).remove();
  }
}

export default ItemAdmin;
