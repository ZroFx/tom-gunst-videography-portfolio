import { useState } from 'react';
import { useGetVideoProjects } from '../hooks/useQueries';
import { useIsCallerAdmin, useUpdateVideoOrder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import VideoCard from '../components/VideoCard';
import VideoLightbox from '../components/VideoLightbox';
import type { VideoProject } from '../backend';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '../components/ui/skeleton';

export default function WorkPage() {
  const { data: projects, isLoading, error } = useGetVideoProjects();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const updateOrder = useUpdateVideoOrder();
  const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderedProjects, setReorderedProjects] = useState<VideoProject[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const isAuthenticated = !!identity;
  const showEditOrderButton = isAuthenticated && isAdmin === true;

  const displayProjects = isReordering ? reorderedProjects : projects || [];

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newProjects = [...reorderedProjects];
    const draggedItem = newProjects[draggedIndex];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(index, 0, draggedItem);

    setReorderedProjects(newProjects);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const startReordering = () => {
    setReorderedProjects([...(projects || [])]);
    setIsReordering(true);
  };

  const cancelReordering = () => {
    setIsReordering(false);
    setReorderedProjects([]);
  };

  const saveOrder = async () => {
    try {
      const newOrder = reorderedProjects.map((p) => p.id);
      await updateOrder.mutateAsync(newOrder);
      toast.success('Video order updated successfully');
      setIsReordering(false);
      setReorderedProjects([]);
    } catch (error) {
      toast.error('Failed to update video order');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center min-h-[40vh] flex-col gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-white/60" />
            <p className="text-gray-400 text-lg">Loading video projects...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-video bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center py-20">
            <p className="text-red-400 text-lg mb-2">Failed to load video projects</p>
            <p className="text-gray-400 text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 lg:px-20 py-12">
      <div className="max-w-[1400px] mx-auto">
        {showEditOrderButton && (
          <div className="mb-6 flex justify-end gap-3">
            {!isReordering ? (
              <Button
                onClick={startReordering}
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/10"
                disabled={!projects || projects.length === 0}
              >
                Edit Order
              </Button>
            ) : (
              <>
                <Button
                  onClick={cancelReordering}
                  variant="outline"
                  className="bg-transparent border-white/20 hover:bg-white/10"
                  disabled={updateOrder.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveOrder}
                  disabled={updateOrder.isPending}
                  className="bg-white text-black hover:bg-white/90"
                >
                  {updateOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Order'
                  )}
                </Button>
              </>
            )}
          </div>
        )}

        {displayProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No videos available yet.</p>
            {showEditOrderButton && (
              <p className="text-gray-500 text-sm mt-2">
                Go to the Admin Panel to add your first video project.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project, index) => (
              <div
                key={project.id}
                draggable={isReordering}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={isReordering ? 'cursor-move' : ''}
              >
                <VideoCard
                  title={project.title}
                  thumbnailUrl={project.thumbnail ? project.thumbnail.getDirectURL() : ''}
                  onClick={() => !isReordering && setSelectedVideo(project)}
                  disabled={isReordering}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoLightbox
          project={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
