export interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  notes: Note[];
}

export interface DataModel {
  groups: Group[];
}

// Global definition for KaTeX attached to window via CDN
declare global {
  interface Window {
    katex: any;
  }
}