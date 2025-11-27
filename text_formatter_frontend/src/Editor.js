import React, { useRef, useCallback } from "react";
import "./Editor.css";

const STORAGE_KEY = "text_formatter_content";
const UNDO_LIMIT = 50;
// Markdown helpers
const applyFormat = (text, selection, cmd) => {
  // Text: current textarea value
  // Selection: { start, end }
  // Returns: new value + new selection
  let { start, end } = selection;
  const selected = text.slice(start, end);
  let before = text.slice(0, start);
  let after = text.slice(end);
  switch (cmd) {
    case "bold":
      return {
        value: before + `**${selected || "bold"}**` + after,
        selection: {
          start: selected ? start + 2 : before.length + 2,
          end: selected ? end + 2 : before.length + 6,
        },
      };
    case "italic":
      return {
        value: before + `*${selected || "italic"}*` + after,
        selection: {
          start: selected ? start + 1 : before.length + 1,
          end: selected ? end + 1 : before.length + 7,
        },
      };
    case "underline":
      // Markdown doesn't support underline, so use custom markup (HTML <u>) for illustration
      return {
        value: before + `<u>${selected || "underline"}</u>` + after,
        selection: {
          start: selected ? start + 3 : before.length + 3,
          end: selected ? end + 3 : before.length + 12,
        },
      };
    case "h1":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "# " +
          (selected || "Heading 1") +
          after,
        selection: {
          start: before.length + 2,
          end: before.length + 2 + (selected || "Heading 1").length,
        },
      };
    case "h2":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "## " +
          (selected || "Heading 2") +
          after,
        selection: {
          start: before.length + 3,
          end: before.length + 3 + (selected || "Heading 2").length,
        },
      };
    case "h3":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "### " +
          (selected || "Heading 3") +
          after,
        selection: {
          start: before.length + 4,
          end: before.length + 4 + (selected || "Heading 3").length,
        },
      };
    case "ol":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "1. " +
          (selected || "List item") +
          after,
        selection: {
          start: before.length + 3,
          end: before.length + 3 + (selected || "List item").length,
        },
      };
    case "ul":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "- " +
          (selected || "List item") +
          after,
        selection: {
          start: before.length + 2,
          end: before.length + 2 + (selected || "List item").length,
        },
      };
    case "blockquote":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "> " +
          (selected || "Blockquote") +
          after,
        selection: {
          start: before.length + 2,
          end: before.length + 2 + (selected || "Blockquote").length,
        },
      };
    case "codeblock":
      return {
        value:
          before +
          (before && before[before.length - 1] !== "\n" ? "\n" : "") +
          "```\n" +
          (selected || "code") +
          "\n```\n" +
          after,
        selection: {
          start: before.length + 4,
          end: before.length + 4 + (selected || "code").length,
        },
      };
    case "inlinecode":
      return {
        value: before + "`" + (selected || "code") + "`" + after,
        selection: {
          start: before.length + 1,
          end: before.length + 1 + (selected || "code").length,
        },
      };
    case "link":
      return {
        value:
          before +
          `[${selected || "text"}](https://example.com)` +
          after,
        selection: {
          start: before.length + 1,
          end: before.length + 1 + (selected || "text").length,
        },
      };
    case "clear":
      // Strip all Markdown formatting as best-effort (simple replace)
      return {
        value: selected
          ? before +
            selected
              .replace(/[*_~`>#\d\[\]().\-!]/g, '')
              .replace(/<\/?u>/g, '') +
            after
          : before + after,
        selection: {
          start: start,
          end: start + (selected
            ? selected
                .replace(/[*_~`>#\d\[\]().\-!]/g, '')
                .replace(/<\/?u>/g, '').length
            : 0),
        },
      };
    default:
      return { value: text, selection };
  }
};


// PUBLIC_INTERFACE
function Editor({
  value,
  setValue,
  undoStack,
  redoStack,
  pushUndo,
  popUndo,
  popRedo,
  clearRedo,
  onFocus,
}) {
  const textareaRef = useRef(null);

  // Set caret/selection after programmatic formatting
  const setCaret = useCallback((start, end) => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(start, end);
  }, []);

  // Handle formatting command (from toolbar or keyboard)
  const handleCommand = cmd => {
    if (cmd === "undo") {
      if (undoStack.length === 0) return;
      const { value: lastValue, selection } = undoStack[undoStack.length - 1];
      popUndo();
      setValue(lastValue);
      window.setTimeout(() => setCaret(selection.start, selection.end), 0);
      return;
    }
    if (cmd === "redo") {
      if (redoStack.length === 0) return;
      const { value: redoValue, selection } = redoStack[redoStack.length - 1];
      popRedo();
      setValue(redoValue);
      window.setTimeout(() => setCaret(selection.start, selection.end), 0);
      return;
    }
    const el = textareaRef.current;
    if (!el) return;
    const selection = { start: el.selectionStart, end: el.selectionEnd };
    pushUndo(value, selection);
    let result = applyFormat(value, selection, cmd);
    setValue(result.value);
    window.setTimeout(() => setCaret(result.selection.start, result.selection.end), 0);
    clearRedo();
  };

  // Keyboard shortcuts handler
  const handleKeyDown = e => {
    const isMac = /Mac/i.test(navigator.userAgent);
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    // Only intercept Bold, Italic, Underline
    if (ctrl && !e.shiftKey && !e.altKey) {
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        handleCommand("bold");
      }
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        handleCommand("italic");
      }
      if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        handleCommand("underline");
      }
      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        handleCommand("undo");
      }
      if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        handleCommand("redo");
      }
    }
  };

  // Persistence: On change, update both state and storage
  const handleChange = e => {
    const el = textareaRef.current;
    const selection = { start: el.selectionStart, end: el.selectionEnd };
    pushUndo(value, selection);
    setValue(e.target.value);
    clearRedo();
    window.localStorage.setItem(STORAGE_KEY, e.target.value);
  };

  // For toolbar to use
  Editor.handleCommand = handleCommand;

  return (
    <div className="editor-container">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={value}
        placeholder="Type or format your text. Use toolbar or shortcuts (Ctrl+B/I/U)..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck
        aria-label="Text input editor"
        onFocus={onFocus}
        rows={18}
      />
    </div>
  );
}

export default Editor;
