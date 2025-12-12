// MathLive uses \placeholder{} to denote a fillable box
export const PLACEHOLDER = '\\placeholder{}';

// Note: Since we are now using MathLive's internal engine for cursor management,
// we no longer need the complex text parsing logic here. 
// The insertion logic is now handled via DOM manipulation in NoteEditor.tsx.
