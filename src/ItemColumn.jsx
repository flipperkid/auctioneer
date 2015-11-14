import React, { Component } from 'react';

import Item from './Item.jsx';

class ItemColumn extends Component {
  constructor() {
    super();
  }

  render() {
    let index = 0;
    let items = Object.keys(this.props.items).map((key) => {
      let item = this.props.items[key];
      return (
        <Item key={key}
          itemId={key}
          bids={this.props.bids[key]}
          adminMode={this.props.adminMode}
          username={this.props.username}
          email={this.props.email}
          uid={this.props.uid}
          closeDate={this.props.closeDate}
          item={item} />);
    });

    let className = 'col-sm-6';
    if (this.props.columnCount < 2) {
      className = 'col-sm-12'
    }


    return (
      <div className={className} >
        {items}
      </div>
    );
  }
}

export default ItemColumn;
