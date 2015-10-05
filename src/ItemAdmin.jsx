import React, { Component } from 'react';
import CardActions from 'material-ui/lib/card/card-actions';
import Dialog from 'material-ui/lib/dialog';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';

import firebase from './firebase';

class ItemAdmin extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let standardActions = [
      { text: 'Cancel', onClick: this.closeDialog.bind(this) },
      { text: 'Confirm', onClick: this.delete.bind(this) }
    ];
    return (
      <div>
        <Dialog title='Confirm Delete?' ref='deleteDialog'
            actions={standardActions}
            modal={false} >
          Are you sure you want to delete this item?
        </Dialog>
        <CardActions expandable={true} className='overflow-hidden'>
          <div className='left-column'>
            <TextField hintText='Title' ref='titleInput'
              value={this.getTitle()}
              onChange={this.updateTitle.bind(this)}
              onBlur={this.persist.bind(this)} />
          </div>
          <div className='right-column'>
            <RaisedButton label='Delete'
              primary={true}
              onClick={this.confirmDelete.bind(this)}/>
          </div>
          <br />
          <TextField hintText='Description' ref='descriptionInput'
            defaultValue={this.props.item.description}
            multiLine={true}
            fullWidth={true}
            onBlur={this.persist.bind(this)} />
          <div className='left-column dollar'>
            <TextField hintText='Starting Bid' ref='startingBidInput'
              defaultValue={this.getStartingBid()}
              type='number'
              step='1'
              disabled={this.hasCurrentBid()}
              errorText={this.state.startingBidError}
              onChange={this.updateStartingBid.bind(this)}
              onBlur={this.persist.bind(this)} />
          </div>
          <div className='right-column'>
            <Toggle label='published?' ref='publishedToggle'
              labelPosition='right'
              defaultToggled={this.props.item.is_published}
              className='position-published'
              onToggle={this.persist.bind(this)} />
          </div>
        </CardActions>
        <hr className='card-divider'/>
      </div>
    );
  }

  getTitle() {
    return this.state.title ? this.state.title : this.props.item.title;
  }

  updateTitle() {
    this.setState({
      title: this.refs.titleInput.getValue()
    });
  }

  getStartingBid() {
    return this.state.startingBid ?
      this.state.startingBid : this.props.item.starting_bid;
  }

  updateStartingBid() {
    this.setState({
      startingBid: this.refs.startingBidInput.getValue()
    });
  }

  hasCurrentBid() {
    return this.props.item.current_bid !== null &&
      this.props.item.current_bid !== undefined;
  }

  persist() {
    var startingBid = this.refs.startingBidInput.getValue();
    var bidFloat = parseFloat(startingBid);
    var isBidValid = /^\d*(?:\.\d)?\d?$/.test(startingBid);
    if (!isBidValid) {
      this.setState({
        startingBidError: 'Starting bid must have at most 2 decimal places.'
      });
      return;
    }
    if(!(bidFloat > 0)) {
      this.setState({
        startingBidError: 'Starting bid must be greater than or equal to 0.'
      });
      return;
    }

    firebase.child('items/'+this.props.itemId).update({
      title: this.refs.titleInput.getValue(),
      description: this.refs.descriptionInput.getValue(),
      is_published: this.refs.publishedToggle.isToggled(),
      starting_bid: bidFloat
    }, () => {
      this.setState({
        title: undefined,
        startingBid: undefined,
        startingBidError: undefined
      });
    });
  }

  confirmDelete() {
    this.refs.deleteDialog.show();
  }

  closeDialog() {
    this.refs.deleteDialog.dismiss();
  }

  delete() {
    firebase.child('items/'+this.props.itemId).remove();
  }
}

export default ItemAdmin;
