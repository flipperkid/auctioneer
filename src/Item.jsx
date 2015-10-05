import React, { Component } from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class Item extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <br />
        <Card initiallyExpanded={this.props.isOpen} >
          <CardHeader
            title={this.getTitle()}
            showExpandableButton={true}
            avatar='http://lorempixel.com/100/100/nature/' />
          <CardMedia
              overlay={
                <CardTitle title={this.getTitle()} />}
              expandable={true} >
            <img src='http://lorempixel.com/600/337/nature/' />
          </CardMedia>
          <ItemAdmin />
          <CardActions expandable={true} >
            <div className='left-column dollar'>
              <TextField floatingLabelText='Bid'
                value={this.getCurrentBid()}
                type='number'
                step='1'
                disabled={true} />
              <span className='spacer'/>
              <RaisedButton label='Bid'
                secondary={true}
                disabled={true} />
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }

  getTitle() {
    return this.state.title ? this.state.title : this.props.item.title;
  }

  getStartingBid() {
    return this.state.startingBid ?
      this.state.startingBid : this.props.item.starting_bid;
  }

  getCurrentBid() {
    return this.hasCurrentBid() ?
      this.props.item.current_bid : this.getStartingBid();
  }

  hasCurrentBid() {
    return this.props.item.current_bid !== null &&
      this.props.item.current_bid !== undefined;
  }
}

export default Item;
