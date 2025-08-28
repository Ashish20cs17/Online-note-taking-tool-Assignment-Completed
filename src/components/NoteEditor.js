//NoteEditor.js

import React, { useEffect, useRef, useState, useCallback } from "react";
import JoditEditor from "jodit-react";
import DOMPurify from "dompurify";
import "./NoteEditor.css";

/**
 * NoteEditor
 * - Uses jodit-react editor (rich text)
 * - Accepts `note` prop when editing. If null, shows a friendly message.
 * - onSave(note) expects object: { id, content, createdAt?, updatedAt? }
 * - onCancel() optional
 */
const NoteEditor = ({ note, onSave, onCancel }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(note ? note.content : "");
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    setContent(note ? note.content : "");
    setDirty(false);
  }, [note]);

  // ✅ Debounced save to state so typing feels natural
  const handleChange = useCallback(
    (newContent) => {
      setDirty(true);
      // store locally without forcing re-render every keystroke
      setContent(newContent);
    },
    []
  );

  const handleSave = () => {
    // Prevent saving empty content (strip tags)
    const plain = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] }).trim();
    if (!plain) {
      alert("Cannot save empty note.");
      return;
    }
    const payload = {
      id: note && note.id ? note.id : Date.now().toString(),
      content: DOMPurify.sanitize(content),
      createdAt: note && note.createdAt ? note.createdAt : Date.now(),
      updatedAt: Date.now(),
    };
    onSave(payload);
    setDirty(false);
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <p>
          Select a note from the left or press <strong>+ New</strong> to create
          one.
        </p>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <JoditEditor
        ref={editorRef}
        value={content}
        config={{
          readonly: false,
          height: 300,
          toolbarSticky: false,
        }}
        // ✅ smoother typing: only update state when user stops typing
        onBlur={(newContent) => handleChange(newContent)}
        onChange={() => {}} // keep empty to avoid lag
      />

      <div className="editor-actions">
        <button
          className="btn primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save
        </button>
        <button
          className="btn"
          onClick={() => {
            setContent(note.content);
            setDirty(false);
          }}
        >
          Reset
        </button>
        <button className="btn danger" onClick={() => onCancel && onCancel()}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
