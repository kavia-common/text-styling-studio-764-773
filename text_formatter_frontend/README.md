# Text Formatter – React

A professional, browser-based text/markdown formatter featuring a live preview, Ocean Professional theme, keyboard shortcuts, and content persistence.

## Features

- **Single-page app**: No backend required.
- **Toolbar**: Format with Bold, Italic, Underline, Headings (H1-H3), Ordered/Unordered Lists, Blockquote, Code Block, Inline Code, Link, Clear Formatting, Undo, Redo.
- **Markdown Input Editor**: Type or format your text, supports markdown or HTML for underline.
- **Live Preview**: See output instantly, with professional Ocean theme styling.
- **Keyboard Shortcuts**: Ctrl/Cmd+B (Bold), Ctrl/Cmd+I (Italic), Ctrl/Cmd+U (Underline), Ctrl/Cmd+Z/Y (Undo/Redo).
- **Responsive Layout**: Side-by-side (desktop), stacked on mobile.
- **Ocean Professional Style**: #2563EB blue, #F59E0B amber, gradients, surface backgrounds, subtle shadows and rounded corners.
- **Persistence**: Content automatically persisted to localStorage.
- **Undo/Redo**: Built-in stateful undo/redo within session.

## Usage

1. Clone and install dependencies (`npm install`)
2. Start development server (`npm start`)
3. Type or format text in the left panel. Results instantly appear on the right.

## Toolbar Formatting

| Button       | Format                    | Markdown Example             | Keyboard Shortcut      |
|--------------|---------------------------|------------------------------|-----------------------|
| **B**        | Bold                      | `**bold**`                   | Ctrl/Cmd+B            |
| *I*          | Italic                    | `*italic*`                   | Ctrl/Cmd+I            |
| U            | Underline                 | `<u>underline</u>`           | Ctrl/Cmd+U            |
| H1/H2/H3     | Heading 1/2/3             | `# Heading 1`                | none                  |
| OL           | Ordered List              | `1. Item`                    | none                  |
| UL           | Unordered List            | `- Item`                     | none                  |
| “ ”          | Blockquote                | `> quoted`                   | none                  |
| &lt;/&gt;    | Code Block                | <pre>```code```</pre>        | none                  |
| code         | Inline Code               | `` `code` ``                 | none                  |
| 🔗           | Link                      | `[text](url)`                | none                  |
| Undo/Redo    | Undo/Redo                 |                              | Ctrl/Cmd+Z, Ctrl/Cmd+Y|
| 🗑            | Clear Formatting          | Strips selection of markdown | none                  |

## Customization

- **Theme**: Toggle dark/light with top right button.
- **Persistence**: Text is saved in your browser (localStorage).
- **Reset**: Clear formatting or delete all text manually.

## Accessibility

- Toolbar buttons have accessible labels and tooltips.
- Keyboard shortcuts work on editor focus.
- Preview panel is focusable for copy.

## Dependencies

- React
- [markdown-it](https://github.com/markdown-it/markdown-it) (for live preview rendering)

## License

MIT

