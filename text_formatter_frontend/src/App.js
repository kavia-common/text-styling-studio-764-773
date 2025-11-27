import React, { useState, useEffect, useRef, useCallback } from "react";
import Toolbar from "./Toolbar";
import Editor from "./Editor";
import Preview from "./Preview";
import "./App.css";

const STORAGE_KEY = "text_formatter_content";

// PUBLIC_INTERFACE
function App() {
  // Theme management
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  // Content state management
  const [value, setValue] = useState("");
  // Undo/redo stack: [{value, selection}]
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const editorRef = useRef();

  // Load initial value from storage
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setValue(stored);
  }, []);

  // Save to storage on change
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, value);
  }, [value]);

  // Functions for undo/redo stacks
  const pushUndo = useCallback(
    (val, selection) => {
      setUndoStack((stack) =>
        stack.length >= 50
          ? [...stack.slice(1), { value: val, selection }]
          : [...stack, { value: val, selection }]
      );
    },
    [setUndoStack]
  );
  const popUndo = useCallback(() => {
    setUndoStack((stack) => stack.slice(0, -1));
  }, []);
  const pushRedo = useCallback(
    (val, selection) => {
      setRedoStack((stack) =>
        stack.length >= 50
          ? [...stack.slice(1), { value: val, selection }]
          : [...stack, { value: val, selection }]
      );
    },
    [setRedoStack]
  );
  const popRedo = useCallback(() => {
    setRedoStack((stack) => stack.slice(0, -1));
  }, []);
  const clearRedo = useCallback(() => setRedoStack([]), []);

  // Toolbar formatting handler
  const handleToolbarCommand = (cmd) => {
    if (editorRef.current) editorRef.current.handleCommand(cmd);
  };

  // Responsive layout: side-by-side, stack on small
  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <main className="formatter-main">
        <h1 className="formatter-title">Text Formatter</h1>
        <p className="formatter-description">
          Format text with markdown or toolbar, and see live preview. <span style={{ color: "#2563EB", fontWeight: 500 }}>Ocean Professional theme.</span>
        </p>
        <Toolbar onCommand={handleToolbarCommand} />
        <div className="formatter-panels-container">
          <section className="formatter-editor-panel">
            <Editor
              ref={editorRef}
              value={value}
              setValue={setValue}
              undoStack={undoStack}
              redoStack={redoStack}
              pushUndo={pushUndo}
              popUndo={popUndo}
              popRedo={popRedo}
              clearRedo={clearRedo}
              onFocus={() => {}}
            />
          </section>
          <section className="formatter-preview-panel">
            <Preview value={value} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
