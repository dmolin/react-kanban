import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);

    this.notes = [];

    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this)
    });
  }
  create(note) {
    const notes = this.notes;
    note.id = uuid.v4();

    //instead of simply updating this.notes,
    //we use this.setState(<'this' object to alter>),
    //to signal Alt that we're going to alter the store state (like using setters in Backbone Models).
    //this will emit a signal to interested listeners (if any)
    this.setState({
      notes: notes.concat(note)
    });
    return note;
  }
  update(updatedNote) {
    //Note the use of map/assign to avoid changing the original object. neat!
    const notes = this.notes.map(note => {
      if(note.id === updatedNote.id) {
        //use Object.assign(), similar to underscore _.extend()
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });
    //the following is the same as this.setState({notes:notes})
    //it's an ES6 feature called 'property shorthand'
    this.setState({notes});
  }
  delete(id) {
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }
  deleteMulti(noteIds) {
    this.setState({
      notes: this.notes.filter(note => noteIds.indexOf(note.id) === -1)
    });
  }
  getNotesByIds(ids) {
    return (ids || [])
      .map(id => this.notes.filter(note => note.id === id))
      //now we have a result in the form:
      //[[Note],[Note],[],[Note]...]
      //filter out possible empty members and extract the note from each one
      .filter(a => a.length).map(a => a[0]);
  }
}

export default alt.createStore(NoteStore, 'NoteStore');