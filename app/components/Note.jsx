import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteSource = {
  beginDrag(props) {
    //console.log('begin dragging note', props);
    return { id: props.id };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    //console.log('dragging note', sourceId, targetId);
    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }

  }
};

@DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),isDragging: monitor.isDragging() }))
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({connectDropTarget: connect.dropTarget()}))
export default class Note extends React.Component {
  render() {
    const {connectDragSource, isDragging, connectDropTarget, id, onMove, ...props} = this.props;

    return connectDragSource(connectDropTarget(
      <li
        {...props}
        style={ {opacity: isDragging ? 0 : 1} }
      >{props.children}</li>
    ));
  }
}

//if we want to mess with the class name
//const {className, connectDragSource, isDragging, connectDropTarget, id, onMove, ...props} = this.props;
//className={ className + ' ' + (isDragging ? ' note--dragging' : '') }
