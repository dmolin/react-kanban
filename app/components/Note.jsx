import React from 'react';

export default class Note extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };
  }
  render() {
    if(this.state.editing) {
      return this.renderEdit();
    }

    return this.renderNote();
  }
  renderNote = () => {

    return (
      <div onClick={this.edit}>
        <span className="task">{this.props.task}</span>
        {this.props.onDelete ? this.renderDelete() : null}
      </div>
    );
  };
  renderEdit = () => {
    //for the ref callback attribute, see: https://facebook.github.io/react/docs/more-about-refs.html
    return <input type="text" className="note-input"
                  ref={(e) => e ? e.selectionStart = this.props.task.length : null}
                  autoFocus={true}
                  defaultValue={this.props.task}
                  onBlur={this.finishEdit}
                  onKeyPress={this.checkEnter} />;
  };
  renderDelete = () => {
    const onDelete = (e) => {
      e.stopPropagation();
      this.props.onDelete(this.props.id);
    };
    return <button className="delete-note" onClick={onDelete}>x</button>;
  };
  edit = () => {
    this.setState({
      editing: true
    });
  };
  checkEnter = (e) => {
    if(e.key === 'Enter') {
      this.finishEdit(e);
    }
  };
  finishEdit = (e) => {
    const value = e.target.value;
    //if a callback handler has been set on the note, notify that the note has been edited
    if(this.props.onEdit) {
      this.props.onEdit(this.props.id, value);
    }

    //exit edit mode
    this.setState({editing:false});
  };
}