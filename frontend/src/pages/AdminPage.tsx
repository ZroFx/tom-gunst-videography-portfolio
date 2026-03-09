import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetAllVideoProjects,
  useAddVideoProject,
  useUpdateVideoProject,
  useUpdateThumbnail,
  useDeleteVideoProject,
  useToggleVideoVisibility,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { Loader2, Upload, Pencil, Trash2, Plus, Eye, EyeOff, Image as ImageIcon, LogIn, Youtube } from 'lucide-react';
import { ExternalBlob } from '../backend';
import type { VideoProject } from '../backend';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ThumbnailGenerator from '../components/ThumbnailGenerator';
import DashboardOverview from '../components/DashboardOverview';

export default function AdminPage() {
  const { identity, isInitializing, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: projects, isLoading: projectsLoading } = useGetAllVideoProjects();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [profileName, setProfileName] = useState('');

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: profileName.trim() });
      toast.success('Profile created successfully');
      setShowProfileSetup(false);
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to log in');
    }
  };

  if (isInitializing || (isAuthenticated && (isAdminLoading || profileLoading))) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-gray-400 mb-6">Please log in to access the admin panel.</p>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="bg-white text-black hover:bg-white/90"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login with Internet Identity
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
          
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-semibold mb-6">Dashboard Overview</h3>
              <DashboardOverview />
            </section>

            <section>
              <AdminContent projects={projects || []} isLoading={projectsLoading} />
            </section>
          </div>
        </div>
      </div>

      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent className="bg-[#262626] border-white/20">
          <DialogHeader>
            <DialogTitle>Welcome! Set up your profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                className="bg-black/30 border-white/20"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              disabled={saveProfile.isPending}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface AdminContentProps {
  projects: VideoProject[];
  isLoading: boolean;
}

function AdminContent({ projects, isLoading }: AdminContentProps) {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Video Projects</h3>
        <Button
          onClick={() => setShowUploadForm(true)}
          className="bg-white text-black hover:bg-white/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="bg-black/30 border-white/20">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">No projects yet. Add your first video project!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => setEditingProject(project)}
            />
          ))}
        </div>
      )}

      {showUploadForm && (
        <ProjectFormDialog
          onClose={() => setShowUploadForm(false)}
          onSuccess={() => setShowUploadForm(false)}
        />
      )}

      {editingProject && (
        <ProjectFormDialog
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: VideoProject;
  onEdit: () => void;
}

function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const deleteProject = useDeleteVideoProject();
  const toggleVisibility = useToggleVideoVisibility();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showThumbnailGenerator, setShowThumbnailGenerator] = useState(false);

  const isYouTubeVideo = !!project.youtubeUrl;
  const canGenerateThumbnail = !isYouTubeVideo && project.video;

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success('Project deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibility.mutateAsync({
        id: project.id,
        visible: !project.visible,
      });
      toast.success(
        project.visible
          ? 'Project hidden from public portfolio'
          : 'Project now visible on public portfolio'
      );
    } catch (error) {
      toast.error('Failed to update visibility');
      console.error(error);
    }
  };

  return (
    <>
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="relative">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail.getDirectURL()}
                  alt={project.title}
                  className="w-48 h-27 object-cover rounded"
                />
              ) : (
                <div className="w-48 h-27 bg-black/50 rounded flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-600" />
                </div>
              )}
              {!project.visible && (
                <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                  <EyeOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
              {isYouTubeVideo && (
                <div className="absolute top-2 right-2 bg-red-600 rounded px-2 py-1 flex items-center gap-1">
                  <Youtube className="w-3 h-3" />
                  <span className="text-xs font-medium">YouTube</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-semibold">{project.title}</h4>
                  {isYouTubeVideo && (
                    <p className="text-xs text-gray-500 mt-1">YouTube: {project.youtubeUrl}</p>
                  )}
                </div>
                <Button
                  onClick={handleToggleVisibility}
                  disabled={toggleVisibility.isPending}
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  title={project.visible ? 'Hide from portfolio' : 'Show on portfolio'}
                >
                  {toggleVisibility.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : project.visible ? (
                    <Eye className="w-5 h-5 text-green-400" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <Button
                    onClick={onEdit}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-white/20 hover:bg-white/10"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {canGenerateThumbnail && (
                    <Button
                      onClick={() => setShowThumbnailGenerator(true)}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-white/20 hover:bg-white/10"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Update Thumbnail
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-red-500/50 hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  {project.visible ? (
                    <span className="text-green-400">● Visible</span>
                  ) : (
                    <span className="text-gray-500">● Hidden</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#262626] border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteProject.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showThumbnailGenerator && canGenerateThumbnail && (
        <ThumbnailGenerator
          projectId={project.id}
          videoUrl={project.video!.getDirectURL()}
          onClose={() => setShowThumbnailGenerator(false)}
        />
      )}
    </>
  );
}

interface ProjectFormDialogProps {
  project?: VideoProject;
  onClose: () => void;
  onSuccess: () => void;
}

function ProjectFormDialog({ project, onClose, onSuccess }: ProjectFormDialogProps) {
  const addProject = useAddVideoProject();
  const updateProject = useUpdateVideoProject();
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [videoType, setVideoType] = useState<'upload' | 'youtube'>(
    project?.youtubeUrl ? 'youtube' : 'upload'
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState(project?.youtubeUrl || '');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (videoType === 'upload' && !isEditing && !videoFile) {
      toast.error('Please select a video file');
      return;
    }

    if (videoType === 'youtube' && !youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    try {
      const id = project?.id || `project-${Date.now()}`;

      let videoBlob: ExternalBlob | null = null;
      let thumbnailBlob: ExternalBlob | null = null;
      let finalYoutubeUrl: string | null = null;

      if (videoType === 'upload') {
        if (videoFile) {
          const videoBytes = new Uint8Array(await videoFile.arrayBuffer());
          videoBlob = ExternalBlob.fromBytes(videoBytes).withUploadProgress((percentage) => {
            setVideoProgress(percentage);
          });
        } else if (project?.video) {
          videoBlob = project.video;
        }
      } else {
        finalYoutubeUrl = youtubeUrl.trim();
      }

      if (thumbnailFile) {
        const thumbnailBytes = new Uint8Array(await thumbnailFile.arrayBuffer());
        thumbnailBlob = ExternalBlob.fromBytes(thumbnailBytes).withUploadProgress((percentage) => {
          setThumbnailProgress(percentage);
        });
      } else if (project?.thumbnail) {
        thumbnailBlob = project.thumbnail;
      }

      if (isEditing) {
        await updateProject.mutateAsync({
          id,
          title: title.trim(),
          description: description.trim(),
          video: videoBlob,
          thumbnail: thumbnailBlob,
          youtubeUrl: finalYoutubeUrl,
        });
        toast.success('Project updated successfully');
      } else {
        await addProject.mutateAsync({
          id,
          title: title.trim(),
          description: description.trim(),
          video: videoBlob,
          thumbnail: thumbnailBlob,
          youtubeUrl: finalYoutubeUrl,
        });
        toast.success('Project added successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update project' : 'Failed to add project');
      console.error(error);
    }
  };

  const isPending = addProject.isPending || updateProject.isPending;
  const showProgress = isPending && (videoProgress > 0 || thumbnailProgress > 0);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#262626] border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              className="bg-black/30 border-white/20"
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              rows={3}
              className="bg-black/30 border-white/20"
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Video Source *</Label>
            <Tabs value={videoType} onValueChange={(v) => setVideoType(v as 'upload' | 'youtube')}>
              <TabsList className="grid w-full grid-cols-2 bg-black/30">
                <TabsTrigger value="upload" disabled={isPending}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="youtube" disabled={isPending}>
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube URL
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="space-y-2 mt-4">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="bg-black/30 border-white/20"
                  disabled={isPending}
                />
                {videoFile && (
                  <p className="text-sm text-gray-400">Selected: {videoFile.name}</p>
                )}
                {isEditing && !videoFile && project?.video && (
                  <p className="text-sm text-gray-400">Current video will be kept</p>
                )}
              </TabsContent>
              <TabsContent value="youtube" className="space-y-2 mt-4">
                <Input
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-black/30 border-white/20"
                  disabled={isPending}
                />
                <p className="text-xs text-gray-500">
                  Enter the full YouTube video URL
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Label htmlFor="thumbnail">
              Thumbnail Image (optional)
              {isEditing && ' - leave empty to keep current'}
            </Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              className="bg-black/30 border-white/20"
              disabled={isPending}
            />
            {thumbnailFile && (
              <p className="text-sm text-gray-400 mt-1">Selected: {thumbnailFile.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {videoType === 'upload'
                ? 'If no thumbnail is provided, you can generate one from the video later.'
                : 'Upload a custom thumbnail for your YouTube video.'}
            </p>
          </div>

          {showProgress && (
            <div className="space-y-3">
              {videoFile && videoProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Uploading video...</span>
                    <span className="text-gray-400">{videoProgress}%</span>
                  </div>
                  <Progress value={videoProgress} className="h-2" />
                </div>
              )}
              {thumbnailFile && thumbnailProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Uploading thumbnail...</span>
                    <span className="text-gray-400">{thumbnailProgress}%</span>
                  </div>
                  <Progress value={thumbnailProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="bg-transparent border-white/20 hover:bg-white/10"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-white text-black hover:bg-white/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Project' : 'Add Project'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
