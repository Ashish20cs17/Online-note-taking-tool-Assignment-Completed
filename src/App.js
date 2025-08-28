// App.js

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";
import QuoteBox from "./components/QuoteBox";
import {
  getNotesFromApi,
  saveNoteToApi,
  deleteNoteFromApi,
  updateNoteToApi,
} from "./services/api";
import "./styles/App.css";
import "./styles/Notes.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // { id, content, createdAt }

  // Load notes from "API" (localStorage wrapper)
  useEffect(() => {
    async function load() {
      const list = await getNotesFromApi();
      setNotes(list);
    }
    load();
  }, []);

  // Create a new note (empty content) and open it for editing
  const createNote = async () => {
    const newNote = {
      id: Date.now().toString(),
      content: "<p></p>",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNoteToApi(newNote);
    setNotes((prev) => [newNote, ...prev]);
    setEditingNote(newNote);
    // scroll to top so editor visible on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save (add or update) note
  const saveNote = async (note) => {
    if (!note || !note.id) return;
    const now = Date.now();
    const noteToSave = { ...note, updatedAt: now };
    // check if exists
    const exists = notes.find((n) => n.id === noteToSave.id);
    if (exists) {
      await updateNoteToApi(noteToSave);
      setNotes((prev) =>
        prev.map((n) => (n.id === noteToSave.id ? noteToSave : n))
      );
    } else {
      await saveNoteToApi(noteToSave);
      setNotes((prev) => [noteToSave, ...prev]);
    }
    setEditingNote(null);
  };

  const deleteNote = async (id) => {
    if (!id) return;
    await deleteNoteFromApi(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingNote && editingNote.id === id) setEditingNote(null);
  };

  const startEdit = (note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => setEditingNote(null);

  return (
    <div className="app-root">
      <Navbar />

      <main className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="app-title">📝 My Notebook</h2>
            <button className="btn primary" onClick={createNote}>
              + New
            </button>
          </div>
          <NotesList notes={notes} onEdit={startEdit} onDelete={deleteNote} />
        </aside>

        {/* Main editor area */}
        <section className="workspace">
          <QuoteBox />
          <div className="editor-wrapper">
            <NoteEditor
              note={editingNote}
              onSave={saveNote}
              onCancel={cancelEdit}
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <small>
          Notebook App — <span className="highlight">LocalStorage</span> — Built
          with ❤️ for portfolio
        </small>
      </footer>
    </div>
  );
}

export default App;
