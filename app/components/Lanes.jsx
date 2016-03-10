import React from 'react';
import Lane from './Lane.jsx';

export default class Lanes extends React.Component {
  render() {
    const {lanes, ...props} = this.props;

    return (
      <div className="lanes">
        {lanes.map(lane =>
          <Lane className="lane" key={lane.id} lane={lane} />
        )}
        <a className="lane add-lane" onClick={this.props.onAddLane}>Add a new lane...</a>
      </div>
    )
  }
}