import React from 'react';
import { AIModelConfig } from '../types';
import { Settings, Cpu, Zap, MessageSquare, Bot, Code } from 'lucide-react';
import { cn } from '../lib/utils';

interface AIConfigProps {
  configs: AIModelConfig[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AIModelConfig>) => void;
}

export const AIConfig: React.FC<AIConfigProps> = ({ configs, onToggle, onUpdate }) => {
  const getIcon = (name: string) => {
    if (name.includes('LLaMA')) return <Cpu className="w-5 h-5" />;
    if (name.includes('TensorFlow')) return <Zap className="w-5 h-5" />;
    if (name.includes('ChatGPT')) return <MessageSquare className="w-5 h-5" />;
    if (name.includes('Copilot')) return <Code className="w-5 h-5" />;
    return <Bot className="w-5 h-5" />;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl font-bold">AI Configuration</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configs.map((config) => (
          <div
            key={config.id}
            className={cn(
              "p-5 rounded-xl border transition-all duration-200",
              config.enabled 
                ? "bg-zinc-900 border-red-900/50 shadow-lg shadow-red-900/10" 
                : "bg-zinc-900/50 border-zinc-800 opacity-70"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  config.enabled ? "bg-red-600/20 text-red-500" : "bg-zinc-800 text-zinc-500"
                )}>
                  {getIcon(config.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                  <p className="text-xs text-zinc-500">{config.description}</p>
                </div>
              </div>
              <button
                onClick={() => onToggle(config.id)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  config.enabled ? "bg-red-600" : "bg-zinc-700"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    config.enabled ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {config.enabled && (
              <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiKey || ''}
                    onChange={(e) => onUpdate(config.id, { apiKey: e.target.value })}
                    placeholder="Enter API key..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">
                    Endpoint URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.endpoint || ''}
                    onChange={(e) => onUpdate(config.id, { endpoint: e.target.value })}
                    placeholder="https://api.example.com/v1"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Developer Note
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          These configurations provide modular hooks for future AI-powered features like real-time pitch correction, 
          automated lyric generation, and vocal removal. Integrate these models by calling the provided 
          <code>useAI()</code> hook in your components.
        </p>
      </div>
    </div>
  );
};
