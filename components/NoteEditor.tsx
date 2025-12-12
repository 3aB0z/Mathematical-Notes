import React, { useRef, useEffect, useState } from 'react';
import { Note } from '../types';
import MathKeyboard from './MathKeyboard';

// Note: The global JSX declaration for 'math-field' was removed here as it was shadowing 
// standard React IntrinsicElements. Since 'math-field' is only used via createElement 
// and not in JSX directly, the declaration is not required.

interface NoteEditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdateNote }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Track last selection range to know where to insert math
  const lastRangeRef = useRef<Range | null>(null);

  // Sync Note Content -> Editor HTML
  useEffect(() => {
    if (note && editorRef.current) {
      // Only update if content is drastically different to avoid cursor jumping
      // Basic check: if empty or note changed completely
      if (editorRef.current.innerHTML !== note.content) {
         editorRef.current.innerHTML = note.content;
      }
    }
  }, [note?.id]);

  // Handle updates from the keyboard
  const handleMathInsert = (template: string) => {
    if (!editorRef.current) return;

    // 1. Check if we are focused INSIDE an existing math-field
    // MathLive elements act as the activeElement when focused
    const activeEl = document.activeElement;
    if (activeEl && activeEl.tagName.toLowerCase() === 'math-field') {
      // We are inside a math field, use MathLive API to insert latex
      (activeEl as any).executeCommand('insert', template);
      return;
    }

    // 2. We are in the text area (or lost focus)
    // Create a new math-field element
    const mathField = document.createElement('math-field');
    mathField.innerText = template; // Initial latex
    mathField.classList.add('inline-math');
    // Disable virtual keyboard triggering since we have our own
    mathField.setAttribute('virtual-keyboard-mode', 'manual');

    // restore selection if available, or append to end
    const selection = window.getSelection();
    let range = lastRangeRef.current;
    
    // If the selection is currently valid and inside our editor, use it
    if (selection && selection.rangeCount > 0 && editorRef.current.contains(selection.anchorNode)) {
      range = selection.getRangeAt(0);
    }

    if (!range || !editorRef.current.contains(range.commonAncestorContainer)) {
      // Fallback: append to end
      range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
    }

    // Insert the math field
    range.deleteContents();
    range.insertNode(mathField);
    
    // Add a space after it for smoother typing flow
    const space = document.createTextNode('\u00A0');
    range.setStartAfter(mathField);
    range.insertNode(space);

    // Focus the new math field
    mathField.focus();

    // Update state
    saveContent();
  };

  const saveContent = () => {
    if (note && editorRef.current) {
      onUpdateNote(note.id, { content: editorRef.current.innerHTML });
    }
  };

  const handleInput = () => {
    saveContent();
    // Update selection ref
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastRangeRef.current = selection.getRangeAt(0);
    }
  };

  const handleBlur = () => {
    // Save selection before blur
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastRangeRef.current = selection.getRangeAt(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      // Optional: Add shortcuts here
  }

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <p>Select a note to begin</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b border-gray-100 bg-white z-10">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdateNote(note.id, { title: e.target.value })}
          className="text-3xl font-bold bg-transparent border-none focus:ring-0 focus:outline-none w-full text-gray-900 placeholder-gray-300"
          placeholder="Note Title"
        />
        <div className="text-sm text-gray-400 mt-1">
          {new Date(note.timestamp).toLocaleDateString()}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-8 cursor-text" onClick={(e) => {
         if(e.target === e.currentTarget && editorRef.current) {
            // Clicked on background, focus the last position or end
            editorRef.current.focus();
         }
      }}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseUp={() => {
             const sel = window.getSelection();
             if(sel && sel.rangeCount > 0) lastRangeRef.current = sel.getRangeAt(0);
          }}
          className="note-editor prose prose-slate max-w-none focus:outline-none text-gray-800 leading-relaxed text-lg empty:before:content-['Start_typing...'] empty:before:text-gray-300"
          spellCheck={false}
        />
      </div>

      {/* Keyboard */}
      <div className="flex-none bg-white border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <MathKeyboard onInsert={handleMathInsert} />
      </div>
    </div>
  );
};

export default NoteEditor;