import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable.jsx';

export default class Lane extends React.Component {
  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
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
            onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    )
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