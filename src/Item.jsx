import React, { Component } from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

import ImagePicker from './ImagePicker.jsx';
import ItemAdmin from './ItemAdmin.jsx';

class Item extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let descriptionDom = undefined;
    if (this.props.item.description) {
      let descriptionLines = this.props.item.description.split('\n');
      descriptionDom = descriptionLines.map((line) => {
        return (<div>{line}</div>);
      });
    }
    let currentBidDom = undefined;
    if (this.hasCurrentBid()) {
      let currentBid = this.getCurrentBid();
      currentBidDom = (
        <div>
          {'Current Bid: $' + currentBid.value + ' by ' + currentBid.username}
        </div>
      );
    }

    let itemAdmin = null;
    if (this.props.adminMode) {
      itemAdmin = (<ItemAdmin itemId={this.props.itemId}
        item={this.props.item}
        bids={this.props.bids || {}}
        hasCurrentBid={this.hasCurrentBid()} />)
    }

    return (
      <div style={{
        marginLeft: '5px',
        marginRight: '5px'
      }}>
        <ImagePicker ref='imagePicker'
          itemId={this.props.itemId} />

        <br />
        <Card>
          <CardTitle title={this.props.item.title} />
          <CardMedia
              overlay={<CardTitle title={this.props.item.title} />}
              onClick={this.setImageSource.bind(this)} >
            <img src={this.getImageSource()} />
          </CardMedia>
          <CardText
            className='overflow-hidden' >
            {descriptionDom}
            {currentBidDom}
            <br />
            <div className='left-column dollar'>
              <TextField floatingLabelText='Bid' ref='bidInput'
                value={this.getCurrentBidValue(1)}
                errorText={this.state.bidError}
                type='number'
                step='1'
                disabled={this.props.adminMode} />
              <span className='spacer'/>
              <RaisedButton label='Bid'
                secondary={true}
                disabled={this.props.adminMode}
                onClick={this.submitBid.bind(this)} />
            </div>
          </CardText>
          {itemAdmin}
        </Card>
      </div>
    );
  }

  /**
   * @private
   */
   submitBid() {
     let bidValue = this.refs.bidInput.getValue();
     let bidFloat = parseFloat(bidValue);
     let isBidValid = /^\d*(?:\.\d)?\d?$/.test(bidValue);
     if (!isBidValid) {
       this.setState({
         bidError: 'Bid must have at most 2 decimal places.'
       });
       return;
     }

     let currentBidPlusOne = this.getCurrentBidValue(1);
     if(bidFloat < currentBidPlusOne) {
       this.setState({
         bidError: 'Bid must be greater than or equal to ' + currentBidPlusOne + '.'
       });
       return;
     }

     firebase.child('bids/'+this.props.itemId).push({
       itemId: this.props.itemId,
       username: this.props.username,
       email: this.props.email,
       value: bidFloat
     }, () => {
       this.setState({
         bidError: undefined
       });
     });
   }

   /**
    * @private
    */
   getCurrentBidValue(increment) {
     let currentBid = this.getCurrentBid();
     return currentBid.value + increment;
   }

   /**
   * @private
   */
  getCurrentBid() {
    if (!this.hasCurrentBid()) {
      return this.props.item.starting_bid;
    }

    let bids = this.props.bids;
    let bidKeys = Object.keys(bids);
    let maxBid = bids[bidKeys[0]];
    for (let idx = 1; idx < bidKeys.length; idx++) {
      let currBid = bids[bidKeys[idx]];
      if (currBid.value > maxBid.value) {
        maxBid = currBid;
      }
    }
    return maxBid;
  }

  /**
   * @private
   */
  hasCurrentBid() {
    let bids = this.props.bids;
    return bids !== null && bids !== undefined && Object.keys(bids).length > 0;
  }

  /**
   * @private
   */
  getImageSource() {
    if (this.props.item.image_source) {
      return this.props.item.image_source;
    }
    return 'https://placehold.it/600x300'
  }

  /**
   * @private
   */
  setImageSource() {
    this.refs.imagePicker.show();
  }
}

export default Item;
