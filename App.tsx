import React, { useState, useEffect } from 'react';
import GroupSidebar from './components/GroupSidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import { DataModel, Group, Note } from './types';

const STORAGE_KEY = 'mathnote_data';

const INITIAL_DATA: DataModel = {
  groups: [
    {
      id: 'g-1',
      name: 'Linear Algebra',
      notes: [
        {
          id: 'n-1',
          title: 'Introduction to Vectors',
          content: 'A vector $\\vec{v}$ in $\\mathbb{R}^n$ is an $n$-tuple.\n\n$$ \\vec{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{bmatrix} $$',
          timestamp: new Date().toISOString()
        }
      ]
    },
    {
      id: 'g-2',
      name: 'Calculus',
      notes: []
    }
  ]
};

const App: React.FC = () => {
  const [data, setData] = useState<DataModel>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('g-1');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>('n-1');

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const activeGroup = data.groups.find(g => g.id === selectedGroupId);
  const activeNote = activeGroup?.notes.find(n => n.id === selectedNoteId) || null;

  const handleAddGroup = (name: string) => {
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name,
      notes: []
    };
    setData(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
    setSelectedGroupId(newGroup.id);
    setSelectedNoteId(null);
  };

  const handleAddNote = () => {
    if (!selectedGroupId) return;
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: 'New Note',
      content: '',
      timestamp: new Date().toISOString()
    };

    setData(prev => ({
      groups: prev.groups.map(g => {
        if (g.id === selectedGroupId) {
          return { ...g, notes: [newNote, ...g.notes] };
        }
        return g;
      })
    }));
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setData(prev => ({
      groups: prev.groups.map(g => ({
        ...g,
        notes: g.notes.map(n => n.id === id ? { ...n, ...updates } : n)
      }))
    }));
  };

  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      <GroupSidebar 
        groups={data.groups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={(id) => {
            setSelectedGroupId(id);
            setSelectedNoteId(null);
        }}
        onAddGroup={handleAddGroup}
      />
      
      <NoteList 
        group={activeGroup}
        selectedNoteId={selectedNoteId}
        onSelectNote={setSelectedNoteId}
        onAddNote={handleAddNote}
      />
      
      <NoteEditor 
        note={activeNote}
        onUpdateNote={handleUpdateNote}
      />
    </div>
  );
};

export default App;