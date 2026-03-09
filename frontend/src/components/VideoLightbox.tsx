import { X, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { VideoProject } from '../backend';
import { useIncrementVideoView } from '../hooks/useQueries';

interface VideoLightboxProps {
  project: VideoProject;
  onClose: () => void;
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export default function VideoLightbox({ project, onClose }: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const incrementVideoView = useIncrementVideoView();
  const hasTrackedView = useRef(false);

  const isYouTubeVideo = !!project.youtubeUrl;
  const youtubeVideoId = isYouTubeVideo ? extractYouTubeVideoId(project.youtubeUrl!) : null;

  useEffect(() => {
    if (!hasTrackedView.current) {
      incrementVideoView.mutate(project.id);
      hasTrackedView.current = true;
    }
  }, [project.id, incrementVideoView]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (isYouTubeVideo) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [isYouTubeVideo]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{project.title}</h2>
          {project.description && (
            <p className="text-gray-400 text-sm md:text-base">{project.description}</p>
          )}
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          {!isYouTubeVideo && (isLoading || isBuffering) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
                <p className="text-white text-sm">
                  {isLoading ? 'Loading video...' : 'Buffering...'}
                </p>
              </div>
            </div>
          )}

          {isYouTubeVideo && youtubeVideoId ? (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : isYouTubeVideo ? (
            <div className="aspect-video w-full flex items-center justify-center bg-black">
              <p className="text-red-400">Invalid YouTube URL</p>
            </div>
          ) : project.video ? (
            <video
              ref={videoRef}
              src={project.video.getDirectURL()}
              controls
              autoPlay
              preload="metadata"
              playsInline
              className="w-full aspect-video"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center bg-black">
              <p className="text-gray-400">No video available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
