import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Minimize, Settings, Music, Video } from 'lucide-react';
import { Track, LyricLine } from '../types';
import { cn } from '../lib/utils';

interface PlayerProps {
  track: Track;
  onNext?: () => void;
  onPrev?: () => void;
}

export const Player: React.FC<PlayerProps> = ({ track, onNext, onPrev }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.play().catch(() => setIsPlaying(false));
      } else {
        mediaRef.current.pause();
      }
    }
  }, [isPlaying, track]);

  useEffect(() => {
    // Reset state when track changes
    setIsPlaying(true);
    setCurrentTime(0);
    setCurrentLyricIndex(-1);
  }, [track]);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      const time = mediaRef.current.currentTime;
      setCurrentTime(time);

      // Sync lyrics
      if (track.lyrics) {
        const index = track.lyrics.findIndex((l, i) => {
          const next = track.lyrics![i + 1];
          return time >= l.time && (!next || time < next.time);
        });
        if (index !== currentLyricIndex) {
          setCurrentLyricIndex(index);
          // Scroll to current lyric
          const activeLyric = lyricsContainerRef.current?.children[index] as HTMLElement;
          if (activeLyric) {
            activeLyric.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (mediaRef.current) {
      mediaRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex flex-col bg-black text-white overflow-hidden group",
        isFullscreen ? "h-screen w-screen" : "aspect-video w-full rounded-2xl shadow-2xl"
      )}
    >
      {/* Media Content */}
      <div className="flex-1 relative bg-zinc-950 flex items-center justify-center">
        {track.type === 'video' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={track.url}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-12">
            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={track.url}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className="w-48 h-48 rounded-full bg-red-600/20 flex items-center justify-center mb-8 relative">
              <div className={cn(
                "absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent",
                isPlaying && "animate-spin"
              )} />
              <Music className="w-20 h-20 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-center">{track.title}</h2>
            <p className="text-zinc-500 mt-2">{track.artist}</p>
          </div>
        )}

        {/* Lyrics Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-24 px-8">
          <div 
            ref={lyricsContainerRef}
            className="max-h-40 overflow-hidden flex flex-col items-center gap-4 mask-fade-edges"
          >
            {track.lyrics?.map((line, i) => (
              <p
                key={i}
                className={cn(
                  "text-2xl md:text-4xl font-bold text-center transition-all duration-300 transform",
                  i === currentLyricIndex 
                    ? "text-red-500 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                    : "text-white/30 scale-90"
                )}
              >
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Overlay (YouTube style) */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12 transition-opacity duration-300",
        !isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {/* Progress Bar */}
        <div className="relative w-full h-1 group/progress mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="absolute inset-0 bg-zinc-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onPrev} className="hover:text-red-500 transition-colors">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current" />
              )}
            </button>
            <button onClick={onNext} className="hover:text-red-500 transition-colors">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            
            <div className="flex items-center gap-2 group/volume ml-2">
              <button onClick={toggleMute}>
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-red-600 h-1"
              />
            </div>

            <div className="text-sm font-medium ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-red-500 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="hover:text-red-500 transition-colors">
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
