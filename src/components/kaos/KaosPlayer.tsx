import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Heart, Music2, Waves, Radio, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useKaosStore, KaosTrack } from '@/stores/kaosStore';
import { cn } from '@/lib/utils';

interface KaosPlayerProps {
  className?: string;
  compact?: boolean;
}

const KaosPlayer = ({ className, compact = false }: KaosPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  const {
    tracks,
    currentTrack,
    isPlaying,
    streamUrl,
    volume,
    loading,
    fetchTracks,
    playTrack,
    pauseTrack,
    resumeTrack,
    setVolume,
    likeTrack
  } = useKaosStore();

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && streamUrl) {
        audioRef.current.src = streamUrl;
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, streamUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    } else if (tracks.length > 0) {
      playTrack(tracks[0].id);
    }
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex].id);
  };

  const playPrev = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIndex].id);
  };

  if (compact) {
    return (
      <div className={cn("glass rounded-xl p-3 flex items-center gap-3", className)}>
        <audio 
          ref={audioRef} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
        />
        
        <Button 
          size="icon" 
          variant="ghost"
          onClick={handlePlayPause}
          disabled={loading}
          className="h-8 w-8"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {currentTrack?.title || 'KAOS 3D™ Audio'}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTrack?.genre || 'Spatial Audio Engine'}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          {isPlaying && (
            <motion.div 
              className="flex gap-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-isabella rounded-full"
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-2xl overflow-hidden", className)}>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />
      
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-isabella/20 to-electric/20">
            <Radio className="h-5 w-5 text-isabella" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">KAOS 3D™ Audio</h3>
            <p className="text-xs text-muted-foreground">Motor de Audio Espacial 4D</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={() => setShowVisualizer(!showVisualizer)}
          >
            <Waves className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visualizer */}
      <AnimatePresence>
        {showVisualizer && isPlaying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 60, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-deep-space/50 to-cosmic/50 flex items-end justify-center gap-0.5 px-4 overflow-hidden"
          >
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 max-w-1 bg-gradient-to-t from-isabella to-electric rounded-t"
                animate={{
                  height: `${20 + Math.random() * 80}%`,
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.02
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Track Info */}
      <div className="p-4">
        {currentTrack ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-isabella/30 to-electric/30 flex items-center justify-center">
              {currentTrack.cover_url ? (
                <img 
                  src={currentTrack.cover_url} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Music2 className="h-6 w-6 text-isabella" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{currentTrack.title}</h4>
              <p className="text-sm text-muted-foreground">{currentTrack.genre || 'Unknown Genre'}</p>
              <div className="flex items-center gap-2 mt-1">
                {currentTrack.bpm && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">{currentTrack.bpm} BPM</span>
                )}
                {currentTrack.emotional_tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs bg-isabella/20 text-isabella px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => likeTrack(currentTrack.id)}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Music2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Selecciona una pista para reproducir</p>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="px-4 pb-2">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 pt-2 flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={playPrev}>
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full bg-gradient-to-r from-isabella to-electric text-white"
          onClick={handlePlayPause}
          disabled={loading}
        >
          {loading ? (
            <Sparkles className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={playNext}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Volume */}
      <div className="px-4 pb-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
        >
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(v) => setVolume(v[0] / 100)}
          className="flex-1"
        />
      </div>

      {/* Track List */}
      <div className="border-t border-border/50 max-h-48 overflow-y-auto">
        {tracks.slice(0, 10).map((track) => (
          <button
            key={track.id}
            onClick={() => playTrack(track.id)}
            className={cn(
              "w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left",
              currentTrack?.id === track.id && "bg-isabella/10"
            )}
          >
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
              {track.cover_url ? (
                <img src={track.cover_url} alt="" className="w-full h-full object-cover rounded" />
              ) : (
                <Music2 className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground">{track.genre} • {track.plays_count} plays</p>
            </div>
            {currentTrack?.id === track.id && isPlaying && (
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-isabella rounded-full"
                    animate={{ height: [3, 10, 3] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default KaosPlayer;
