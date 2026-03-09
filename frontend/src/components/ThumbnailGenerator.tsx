import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2, Camera } from 'lucide-react';
import { ExternalBlob } from '../backend';
import { useUpdateThumbnail } from '../hooks/useQueries';
import { toast } from 'sonner';

interface ThumbnailGeneratorProps {
  projectId: string;
  videoUrl: string;
  onClose: () => void;
}

export default function ThumbnailGenerator({ projectId, videoUrl, onClose }: ThumbnailGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const updateThumbnail = useUpdateThumbnail();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      setIsVideoLoading(false);
    };

    const handleLoadedData = () => {
      setIsVideoReady(true);
      setIsVideoLoading(false);
    };

    const handleCanPlay = () => {
      setIsVideoReady(true);
      setIsVideoLoading(false);
    };

    const handleLoadStart = () => {
      setIsVideoLoading(true);
    };

    // Add multiple event listeners to ensure we catch when video is ready
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadstart', handleLoadStart);

    // Check if video is already ready (in case events already fired)
    if (video.readyState >= 2) {
      setIsVideoReady(true);
      setIsVideoLoading(false);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      toast.error('Video or canvas not available');
      return;
    }

    // Check if video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast.error('Video not ready. Please wait for the video to load.');
      return;
    }

    const aspectRatio = 16 / 9;
    canvas.width = 1280;
    canvas.height = 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Could not get canvas context');
      return;
    }

    const videoAspect = video.videoWidth / video.videoHeight;
    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;

    // Crop video to 16:9 aspect ratio
    if (videoAspect > aspectRatio) {
      // Video is wider than 16:9, crop sides
      sw = video.videoHeight * aspectRatio;
      sx = (video.videoWidth - sw) / 2;
    } else if (videoAspect < aspectRatio) {
      // Video is taller than 16:9, crop top/bottom
      sh = video.videoWidth / aspectRatio;
      sy = (video.videoHeight - sh) / 2;
    }

    // Draw the cropped video frame to canvas
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageUrl);
    toast.success('Frame captured successfully');
  };

  const handleSaveThumbnail = async () => {
    if (!capturedImage) {
      toast.error('Please capture a frame first');
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const thumbnailBytes = new Uint8Array(arrayBuffer);
      
      // Create ExternalBlob with upload progress tracking
      const thumbnailBlob = ExternalBlob.fromBytes(thumbnailBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Upload thumbnail to backend
      await updateThumbnail.mutateAsync({
        id: projectId,
        thumbnail: thumbnailBlob,
      });

      toast.success('Thumbnail updated successfully');
      setUploadProgress(0);
      onClose();
    } catch (error) {
      toast.error('Failed to update thumbnail');
      console.error('Thumbnail update error:', error);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#262626] border-white/20 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generate Thumbnail from Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="w-full"
              style={{ maxHeight: '60vh' }}
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {capturedImage && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Preview:</p>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured thumbnail"
                  className="w-full"
                />
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uploading thumbnail...</span>
                <span className="text-gray-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10"
              disabled={updateThumbnail.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={captureFrame}
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10"
              disabled={!isVideoReady || updateThumbnail.isPending}
            >
              <Camera className="w-4 h-4 mr-2" />
              Grab this frame
            </Button>
            <Button
              onClick={handleSaveThumbnail}
              disabled={!capturedImage || updateThumbnail.isPending}
              className="bg-white text-black hover:bg-white/90"
            >
              {updateThumbnail.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Thumbnail'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
