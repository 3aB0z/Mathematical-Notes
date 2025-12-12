import React, { useState } from 'react';
import { Note, Group } from '../types';

interface NoteListProps {
  group: Group | undefined;
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
}

const NoteList: React.FC<NoteListProps> = ({
  group,
  selectedNoteId,
  onSelectNote,
  onAddNote,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!group) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
        Select a group to view notes
      </div>
    );
  }

  const filteredNotes = group.notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 truncate">{group.name}</h2>
        <div className="mt-2 relative">
          <input 
            type="text"
            placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
           <div className="p-4 text-sm text-gray-500 text-center italic">No notes found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => onSelectNote(note.id)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedNoteId === note.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="font-semibold text-gray-800 text-sm mb-1 truncate">
                    {note.title || 'Untitled Note'}
                  </div>
                  <div className="text-xs text-gray-500 truncate mb-1">
                    {note.content.substring(0, 50)}...
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(note.timestamp).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onAddNote}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow transition-colors"
        >
          Create Note
        </button>
      </div>
    </div>
  );
};

export default NoteList;