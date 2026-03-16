import React from 'react';
import { Home, Folder, Settings, History, Heart, PlaySquare, Music2, Mic2 } from 'lucide-react';
import { TabType } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'player', label: 'Home', icon: Home },
    { id: 'explorer', label: 'Explorer', icon: Folder },
    { id: 'ai-config', label: 'AI Config', icon: Settings },
  ];

  const secondaryItems = [
    { label: 'History', icon: History },
    { label: 'Liked Songs', icon: Heart },
    { label: 'My Playlists', icon: PlaySquare },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full py-4">
      <div className="px-6 mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Mic2 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tighter">KarokTube</span>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as TabType)}
            className={cn(
              "w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
              activeTab === item.id 
                ? "bg-zinc-900 text-white" 
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-red-600" : "")} />
            {item.label}
          </button>
        ))}

        <div className="my-4 border-t border-zinc-800 mx-3" />

        {secondaryItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-white"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <Music2 className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Now Playing</span>
          </div>
          <p className="text-xs font-medium truncate">Select a track to start</p>
        </div>
      </div>
    </div>
  );
};
