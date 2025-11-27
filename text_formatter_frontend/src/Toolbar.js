import React from "react";
import "./Toolbar.css";

const BUTTONS = [
  {
    cmd: "bold",
    icon: <b>B</b>,
    label: "Bold",
    shortcut: "Ctrl+B / Cmd+B",
  },
  {
    cmd: "italic",
    icon: <i>I</i>,
    label: "Italic",
    shortcut: "Ctrl+I / Cmd+I",
  },
  {
    cmd: "underline",
    icon: <u>U</u>,
    label: "Underline",
    shortcut: "Ctrl+U / Cmd+U",
  },
  { cmd: "h1", icon: <span>H1</span>, label: "Heading 1" },
  { cmd: "h2", icon: <span>H2</span>, label: "Heading 2" },
  { cmd: "h3", icon: <span>H3</span>, label: "Heading 3" },
  { cmd: "ol", icon: <span>&#35; OL</span>, label: "Ordered List" },
  { cmd: "ul", icon: <span>&bull; UL</span>, label: "Unordered List" },
  { cmd: "blockquote", icon: <span>&ldquo; &rdquo;</span>, label: "Blockquote" },
  { cmd: "codeblock", icon: <span>&lt;/&gt;</span>, label: "Code Block" },
  { cmd: "inlinecode", icon: <span style={{fontFamily:'monospace'}}>code</span>, label: "Inline Code" },
  { cmd: "link", icon: <span>&#128279;</span>, label: "Link" },
  { cmd: "undo", icon: <span>&#8630;</span>, label: "Undo" },
  { cmd: "redo", icon: <span>&#8631;</span>, label: "Redo" },
  { cmd: "clear", icon: <span>&#9003;</span>, label: "Clear Formatting" },
];

// PUBLIC_INTERFACE
function Toolbar({ onCommand }) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Formatting">
      {BUTTONS.map((btn) => (
        <button
          key={btn.cmd}
          className="toolbar-btn"
          onMouseDown={e => { e.preventDefault(); onCommand(btn.cmd); }}
          aria-label={btn.label + (btn.shortcut ? `. Shortcut: ${btn.shortcut}` : "")}
          title={btn.label + (btn.shortcut ? ` (${btn.shortcut})` : "")}
          type="button"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
