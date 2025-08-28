import React from "react";
import DOMPurify from "dompurify";

/**
 * NotesList
 * - shows a list of notes (title preview from sanitized text)
 * - newest first
 */
const NotesList = ({ notes = [], onEdit, onDelete }) => {
  return (
    <div className="notes-list">
      {notes.length === 0 && <p className="muted">No notes yet — click <strong>+ New</strong> to create one.</p>}
      {notes.slice().sort((a,b)=> b.updatedAt - a.updatedAt).map((note) => {
        // derive plain text preview: strip tags then shorten
        const safely = DOMPurify.sanitize(note.content || "");
        const tmp = safely.replace(/<[^>]*>/g, "");
        const preview = (tmp || "Empty note").slice(0, 60);
        const date = new Date(note.updatedAt || note.createdAt || Date.now()).toLocaleString();
        return (
          <div className="note-item" key={note.id}>
            <div className="note-left" onClick={() => onEdit(note)}>
              <div className="note-preview">{preview || "Empty note"}</div>
              <div className="note-date">{date}</div>
            </div>
            <div className="note-actions">
              <button className="btn small" onClick={() => onEdit(note)}>Edit</button>
              <button className="btn small danger" onClick={() => { if (window.confirm("Delete this note?")) onDelete(note.id); }}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotesList;
