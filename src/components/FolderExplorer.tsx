import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Folder, FileMusic, FileVideo, Search, Grid, List as ListIcon, MoreVertical, Play } from 'lucide-react';
import { Track } from '../types';
import { cn } from '../lib/utils';

interface FolderExplorerProps {
  onSelectTrack: (track: Track) => void;
}

export const FolderExplorer: React.FC<FolderExplorerProps> = ({ onSelectTrack }) => {
  const [files, setFiles] = useState<Track[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newTracks: Track[] = acceptedFiles
      .filter(file => file.type.startsWith('audio/') || file.type.startsWith('video/'))
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Local Artist',
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'video' : 'audio',
        thumbnail: 'https://picsum.photos/seed/' + file.name + '/300/200'
      }));
    
    setFiles(prev => [...prev, ...newTracks]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: files.length > 0
  } as any);

  const filteredFiles = files.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search local tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-1.5 rounded", viewMode === 'grid' ? "bg-zinc-800 text-white" : "text-zinc-500")}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn("p-1.5 rounded", viewMode === 'list' ? "bg-zinc-800 text-white" : "text-zinc-500")}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 relative" {...getRootProps()}>
        <input {...getInputProps()} />
        
        {files.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center">
              <Folder className="w-10 h-10 text-zinc-700" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">No tracks found</h3>
              <p className="text-zinc-500 max-w-xs mx-auto mt-2">
                Drag and drop your audio or video files here to start your karaoke session.
              </p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
              Select Files
            </button>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "flex flex-col gap-2"
          )}>
            {filteredFiles.map((track) => (
              <div 
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className={cn(
                  "group cursor-pointer transition-all",
                  viewMode === 'grid' 
                    ? "flex flex-col gap-3"
                    : "flex items-center gap-4 p-2 hover:bg-zinc-900 rounded-lg"
                )}
              >
                <div className={cn(
                  "relative overflow-hidden rounded-xl bg-zinc-900",
                  viewMode === 'grid' ? "aspect-video" : "w-24 h-14 shrink-0"
                )}>
                  <img 
                    src={track.thumbnail} 
                    alt={track.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {track.type}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-red-500 transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
                </div>
                
                {viewMode === 'list' && (
                  <button className="p-2 text-zinc-500 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isDragActive && (
          <div className="absolute inset-0 bg-red-600/20 backdrop-blur-sm border-2 border-dashed border-red-600 flex items-center justify-center z-50">
            <div className="bg-zinc-950 p-8 rounded-2xl shadow-2xl text-center">
              <Folder className="w-12 h-12 text-red-600 mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold">Drop to Import</h2>
              <p className="text-zinc-400">Release to add files to KarokTube</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
