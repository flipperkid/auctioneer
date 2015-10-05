import React, { Component } from 'react';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Toggle from 'material-ui/lib/toggle';

import ActionTypes from './ActionTypes';
import DeleteConfirmation from './DeleteConfirmation.jsx';
import firebase from './firebase';
import store from './store';

class ItemAdmin extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <DeleteConfirmation ref='deleteConfirmation'
          itemId={this.props.itemId} />

        <hr className='card-divider'/>
        <CardActions
          expandable={true}
          className='overflow-hidden'>
          <CardTitle subtitle='Edit' className='edit-title' />
          <div className='left-column'>
            <TextField hintText='Title' ref='titleInput'
              defaultValue={this.props.item.title}
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
            onChange={this.updateDescription.bind(this)}
            onBlur={this.persist.bind(this)} />
          <div className='left-column dollar'>
            <TextField hintText='Starting Bid' ref='startingBidInput'
              defaultValue={this.props.item.starting_bid}
              type='number'
              step='1'
              disabled={this.props.hasCurrentBid}
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
      </div>
    );
  }

  /**
   * @private
   */
  updateTitle() {
    store.dispatch({
      type: ActionTypes.UPDATE_ITEM,
      id: this.props.itemId,
      item: {
        title: this.refs.titleInput.getValue()
      }
    });
  }

  /**
   * @private
   */
  updateStartingBid() {
    store.dispatch({
      type: ActionTypes.UPDATE_ITEM,
      id: this.props.itemId,
      item: {
        starting_bid: this.refs.startingBidInput.getValue()
      }
    });
  }

  /**
   * @private
   */
  updateDescription() {
    store.dispatch({
      type: ActionTypes.UPDATE_ITEM,
      id: this.props.itemId,
      item: {
        description: this.refs.descriptionInput.getValue()
      }
    });
  }

  /**
   * @private
   */
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
        startingBidError: undefined
      });
    });
  }

  /**
   * @private
   */
  confirmDelete() {
    this.refs.deleteConfirmation.show();
  }
}

export default ItemAdmin;
