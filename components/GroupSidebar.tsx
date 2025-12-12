import React, { useState } from 'react';
import { Group } from '../types';

interface GroupSidebarProps {
  groups: Group[];
  selectedGroupId: string | null;
  onSelectGroup: (id: string) => void;
  onAddGroup: (name: string) => void;
}

const GroupSidebar: React.FC<GroupSidebarProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onAddGroup,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onAddGroup(newGroupName.trim());
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full border-r border-slate-700">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-wider">MathNote</h1>
        <p className="text-xs text-slate-400">Pro Edition</p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Notebooks
        </div>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <button
                onClick={() => onSelectGroup(group.id)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  selectedGroupId === group.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{group.name}</span>
                <span className="ml-2 text-xs text-slate-500 float-right">
                  {group.notes.length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-700">
        {isCreating ? (
          <form onSubmit={handleCreateSubmit}>
            <input
              type="text"
              autoFocus
              className="w-full px-2 py-1 text-sm bg-slate-800 border border-slate-600 rounded text-white focus:outline-none focus:border-blue-500"
              placeholder="Group Name..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onBlur={() => !newGroupName && setIsCreating(false)}
            />
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            + New Group
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupSidebar;