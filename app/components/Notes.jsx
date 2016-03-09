import React from 'react';
import Note from './Note.jsx';

export default ({notes, onEdit, onDelete}) => {
  return (
    <ul className="notes">
      {notes.map(note =>
        <li className="note" key={note.id}>
          <Note task={note.task} id={note.id}
                onEdit={onEdit}
                onDelete={onDelete} />
        </li>
      )}
    </ul>
  );
}