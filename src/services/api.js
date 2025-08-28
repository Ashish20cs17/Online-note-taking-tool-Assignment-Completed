/**
 * services/api.js
 *
 * Simple "API" wrapper that persists notes to localStorage.
 * This simulates an API while keeping everything local so you can
 * swap to a real backend later by replacing these functions.
 *
 * Also provides fetchQuote() which attempts a remote API and falls back with error.
 */

const STORAGE_KEY = "notebook_app_notes_v1";

/* --- Notes API (localStorage-backed) --- */

export async function getNotesFromApi() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // ensure array and objects have timestamps
    return parsed.map((p) => ({
      id: p.id,
      content: p.content,
      createdAt: p.createdAt || Date.now(),
      updatedAt: p.updatedAt || p.createdAt || Date.now(),
    }));
  } catch (e) {
    console.error("Failed to read notes from localStorage", e);
    return [];
  }
}

export async function saveNoteToApi(note) {
  const list = await getNotesFromApi();
  list.unshift(note);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return note;
  } catch (e) {
    console.error("Failed to save note", e);
    throw e;
  }
}

export async function updateNoteToApi(note) {
  const list = await getNotesFromApi();
  const updated = list.map((n) => (n.id === note.id ? note : n));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return note;
  } catch (e) {
    console.error("Failed to update note", e);
    throw e;
  }
}

export async function deleteNoteFromApi(id) {
  const list = await getNotesFromApi();
  const filtered = list.filter((n) => n.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error("Failed to delete note", e);
    throw e;
  }
}

/* --- Quotes API --- */

export async function fetchQuote() {
  // try remote API (may be blocked on some networks)
  try {
    const res = await fetch("https://api.quotable.io/random", { method: "GET" });
    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();
    if (data && data.content) {
      return `"${data.content}" — ${data.author || "Unknown"}`;
    }
    throw new Error("Invalid data");
  } catch (e) {
    // bubble up to caller so it can use its fallback rotation
    throw e;
  }
}
