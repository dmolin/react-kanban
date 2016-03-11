import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const laneSource = {
  beginDrag(props) {
    return { id: props.id };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const dropTargetSpec = {
  hover(targetProps, monitor) {
    const type = monitor.getItemType();
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    const targetId = targetProps.id;

    //console.log("lane target", sourceId, targetId);
    switch(type) {
      case ItemTypes.NOTE:
        if(!targetProps.lane.notes.length) {
          console.log("receiving note");
          LaneActions.attachToLane({
            laneId: targetProps.lane.id,
            noteId: sourceId
          });
        }
        break;
      case ItemTypes.LANE:
        if(sourceId !== targetId) {
          LaneActions.moveLane({sourceId, targetId});
        }
        break;
      default:
        console.log("Unknown item type on hover", type);
    }
  }
};

@DragSource(ItemTypes.LANE, laneSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),isDragging: monitor.isDragging() }))
@DropTarget([ItemTypes.NOTE, ItemTypes.LANE], dropTargetSpec, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  render() {
    const {connectDragSource, isDragging, connectDropTarget, lane, ...props} = this.props;

    return connectDragSource(connectDropTarget(
      <div
        style={ {opacity: isDragging ? 0 : 1} }
        {...props}>
        <div className="lane-content">
          <div className="lane-header" onClick={this.activateLaneEdit}>
            <Editable className="lane-name" editing={lane.editing}
                      value={lane.name} onEdit={this.editName} />
            <a className="lane-delete" href="#" onClick={this.deleteLane}>x</a>
            <a className="lane-add-note" onClick={this.addNote}>Add a card...</a>
          </div>

          <AltContainer
            stores={[NoteStore]}
            inject={
              {notes: () => NoteStore.getNotesByIds(lane.notes) || []}
            }
          >
            <Notes
              onValueClick={this.activateNoteEdit}
              onEdit={this.editNote}
              onDelete={this.deleteNote}
              onMove={LaneActions.move} />
          </AltContainer>
        </div>
      </div>
    ))
  }
  addNote = (e) => {
    e.stopPropagation();

    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New Task', editing:true});

    LaneActions.attachToLane({
      noteId: note.id,
      laneId
    });
  };
  deleteNote = (id) => {
    const laneId = this.props.lane.id;
    LaneActions.detachFromLane({laneId, noteId:id});
    NoteActions.delete(id);
  };
  editName = (name) => {
    const laneId = this.props.lane.id;
    if(!name.trim()) {
      LaneActions.update({id:laneId, editing:false});
    }
    LaneActions.update({id:laneId, name, editing:false});
  };
  deleteLane = (e) => {
    e.stopPropagation();
    const laneId = this.props.lane.id;
    //might me useful to delete the notes from the lane first, then delete the lane itself
    NoteActions.deleteMulti(this.props.lane.notes);
    LaneActions.delete(laneId);
  };
  activateLaneEdit = () => {
    const laneId = this.props.lane.id;
    //console.log(`activate lane ${laneId} editing`);
    LaneActions.update({id:laneId, editing:true});
  };
  activateNoteEdit = (id) => {
    //console.log(`activate note ${id} editing`);
    NoteActions.update({id, editing:true});
  };
  editNote(id, task) {
    if(!task.trim()) {
      NoteActions.update({id, editing:false});
      return;
    }
    NoteActions.update({id,task, editing:false});
  }
}