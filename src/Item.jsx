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
  }

  render() {
    let descriptionLines = this.props.item.description.split('\n');
    let descriptionDom = descriptionLines.map((line) => {
      return (<div>{line}</div>);
    });
    let currentBidDom = undefined;
    if (this.hasCurrentBid()) {
      currentBidDom = (
        <div>
          {'Current Bid: $' + this.getCurrentBid(0)}
        </div>
      );
    }

    return (
      <div>
        <ImagePicker ref='imagePicker'
          itemId={this.props.itemId} />

        <br />
        <Card initiallyExpanded={this.props.isOpen} >
          <CardTitle
            title={this.props.item.title}
            showExpandableButton={true} />
          <CardMedia
              overlay={<CardTitle title={this.props.item.title} />}
              expandable={true}
              onClick={this.setImageSource.bind(this)} >
            <img src={this.getImageSource()} />
          </CardMedia>
          <CardText
            expandable={true}
            className='overflow-hidden' >
            {descriptionDom}
            {currentBidDom}
            <br />
            <div className='left-column dollar'>
              <TextField floatingLabelText='Bid'
                value={this.getCurrentBid(1)}
                type='number'
                step='1'
                disabled={true} />
              <span className='spacer'/>
              <RaisedButton label='Bid'
                secondary={true}
                disabled={true} />
            </div>
          </CardText>

          <ItemAdmin
            expandable={true}
            itemId={this.props.itemId}
            item={this.props.item}
            hasCurrentBid={this.hasCurrentBid()} />
        </Card>
      </div>
    );
  }

  /**
   * @private
   */
  getCurrentBid(increment) {
    return this.hasCurrentBid() ?
      this.props.item.current_bid + increment : this.props.item.starting_bid;
  }

  /**
   * @private
   */
  hasCurrentBid() {
    return this.props.item.current_bid !== null &&
      this.props.item.current_bid !== undefined;
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
