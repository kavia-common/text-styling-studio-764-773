import React from "react";
import MarkdownIt from "markdown-it";
import "./Preview.css";

// Use markdown-it with sane configuration (inline HTML enabled for underline)
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
});

// PUBLIC_INTERFACE
function Preview({ value }) {
  // Dangerous, but input is user-only and inline <u> used for underline
  return (
    <div
      className="preview-panel"
      tabIndex={0}
      aria-label="Live formatted preview"
      dangerouslySetInnerHTML={{ __html: md.render(value || "") }}
    />
  );
}

export default Preview;
