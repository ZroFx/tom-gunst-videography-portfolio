import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetStats, useGetAllVideoProjects } from '../hooks/useQueries';
import { Loader2, Eye, Users, Video } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: projects } = useGetAllVideoProjects();

  const videoViewsMap = useMemo(() => {
    if (!stats?.videoViews) return new Map<string, number>();
    return new Map(stats.videoViews.map(([id, views]) => [id, Number(views)]));
  }, [stats?.videoViews]);

  const topVideos = useMemo(() => {
    if (!projects || !stats?.videoViews) return [];
    
    const videosWithViews = projects
      .map((project) => ({
        ...project,
        views: videoViewsMap.get(project.id) || 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return videosWithViews;
  }, [projects, stats?.videoViews, videoViewsMap]);

  const totalVideoViews = useMemo(() => {
    if (!stats?.videoViews) return 0;
    return stats.videoViews.reduce((sum, [, views]) => sum + Number(views), 0);
  }, [stats?.videoViews]);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Visits</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats?.totalVisits || 0).toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Site-wide page visits</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Video Views</CardTitle>
            <Eye className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVideoViews.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Across all videos</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
            <Video className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">
              {projects?.filter((p) => p.visible).length || 0} visible
            </p>
          </CardContent>
        </Card>
      </div>

      {topVideos.length > 0 && (
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-lg">Top Videos by Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-gray-500 font-medium text-sm w-6 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{video.title}</p>
                      {!video.visible && (
                        <span className="text-xs text-gray-500">(Hidden)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 flex-shrink-0">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{video.views.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topVideos.length === 0 && (
        <Card className="bg-black/30 border-white/20">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">No video views recorded yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
