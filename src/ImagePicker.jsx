import React, { Component } from 'react';
import Dialog from 'material-ui/lib/dialog';
import TextField from 'material-ui/lib/text-field';

import firebase from './firebase';

class ImagePicker extends Component {
  constructor() {
    super();
  }

  render() {
    let standardActions = [
      { text: 'Cancel' },
      { text: 'OK', onClick: this.pick.bind(this) }
    ];
    return (
      <Dialog title='Choose Image' ref='imageDialog'
          actions={standardActions}
          modal={false} >
          <TextField ref='imageLocation'
            fullWidth={true}
            hintText='https://s3.amazonaws.com/cj-auctioneer/shoes.jpg' />
      </Dialog>
    );
  }

  show() {
    this.refs.imageDialog.show();
  }

  /**
   * @private
   */
  pick() {
    firebase.child('items/'+this.props.itemId).update({
      image_source: this.refs.imageLocation.getValue()
    });
    this.refs.imageDialog.dismiss();
  }
}

export default ImagePicker;
