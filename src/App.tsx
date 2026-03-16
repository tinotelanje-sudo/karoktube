import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { FolderExplorer } from './components/FolderExplorer';
import { AIConfig } from './components/AIConfig';
import { Track, AIModelConfig, TabType } from './types';
import { cn } from './lib/utils';

const INITIAL_AI_CONFIGS: AIModelConfig[] = [
  { id: '1', name: 'LLaMA 3', enabled: false, description: 'Local LLM for lyric generation and analysis.' },
  { id: '2', name: 'TensorFlow Lite', enabled: true, description: 'On-device pitch detection and vocal separation.' },
  { id: '3', name: 'Sonnet 4.6', enabled: false, description: 'Advanced reasoning for musical composition.' },
  { id: '4', name: 'Opus 4.5', enabled: false, description: 'High-fidelity audio processing and transcription.' },
  { id: '5', name: 'GitHub Copilot', enabled: false, description: 'Code-level integration for custom audio filters.' },
  { id: '6', name: 'ChatGPT 5.0', enabled: false, description: 'Conversational interface for song requests.' },
];

const SAMPLE_TRACK: Track = {
  id: 'sample-1',
  title: 'KarokTube Demo',
  artist: 'KarokTube Team',
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  type: 'audio',
  thumbnail: 'https://picsum.photos/seed/karoktube/800/450',
  lyrics: [
    { time: 0, text: "Welcome to KarokTube!" },
    { time: 5, text: "The ultimate AI-powered karaoke experience." },
    { time: 10, text: "Browse your local files in the Explorer." },
    { time: 15, text: "Configure your AI models in the Settings." },
    { time: 20, text: "Enjoy high-quality synchronized lyrics." },
    { time: 25, text: "Start singing your heart out now!" },
    { time: 30, text: "KarokTube: Your stage, your rules." },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('player');
  const [currentTrack, setCurrentTrack] = useState<Track>(SAMPLE_TRACK);
  const [aiConfigs, setAiConfigs] = useState<AIModelConfig[]>(INITIAL_AI_CONFIGS);

  const handleToggleAI = (id: string) => {
    setAiConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, enabled: !c.enabled } : c
    ));
  };

  const handleUpdateAI = (id: string, updates: Partial<AIModelConfig>) => {
    setAiConfigs(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setActiveTab('player');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans selection:bg-red-600/30">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation / Search Bar (YouTube Style) */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-sm font-bold transition-colors">
              Go Premium
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Karok" alt="User" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'player' && (
            <div className="p-8 max-w-6xl mx-auto space-y-8">
              <Player track={currentTrack} />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{currentTrack.title}</h1>
                      <p className="text-zinc-500">{currentTrack.artist}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-sm font-medium transition-colors">
                        Share
                      </button>
                      <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-sm font-medium transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                    <h3 className="font-bold mb-2">Description</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Experience this track with KarokTube's advanced synchronization. 
                      Enable AI models in the config tab to unlock real-time enhancements.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-zinc-400 uppercase text-xs tracking-widest">Up Next</h3>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 group cursor-pointer">
                      <div className="w-32 aspect-video bg-zinc-900 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={`https://picsum.photos/seed/next-${i}/300/200`} 
                          alt="Next" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate group-hover:text-red-500 transition-colors">Recommended Track {i}</h4>
                        <p className="text-xs text-zinc-500">Suggested Artist</p>
                        <p className="text-[10px] text-zinc-600 mt-1">1.2M views • 2 days ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explorer' && (
            <FolderExplorer onSelectTrack={handleSelectTrack} />
          )}

          {activeTab === 'ai-config' && (
            <AIConfig 
              configs={aiConfigs} 
              onToggle={handleToggleAI} 
              onUpdate={handleUpdateAI} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
