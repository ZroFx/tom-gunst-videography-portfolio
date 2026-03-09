import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { VideoProject, ContactInfo, SocialMediaLink, UserProfile, Stats } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetVideoProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoProject[]>({
    queryKey: ['videoProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVideoProjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useGetAllVideoProjects() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<VideoProject[]>({
    queryKey: ['allVideoProjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideoProjects();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetVideoProject(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VideoProject | null>({
    queryKey: ['videoProject', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideoProject(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo | null>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !!identity && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStats();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useIncrementVideoView() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.incrementVideoView(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useIncrementTotalVisits() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.incrementTotalVisits();
    },
  });
}

export function useAddVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      video,
      thumbnail,
      youtubeUrl,
    }: {
      id: string;
      title: string;
      description: string;
      video: ExternalBlob | null;
      thumbnail: ExternalBlob | null;
      youtubeUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addVideoProject(id, title, description, video, thumbnail, youtubeUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}

export function useUpdateVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      video,
      thumbnail,
      youtubeUrl,
    }: {
      id: string;
      title: string;
      description: string;
      video: ExternalBlob | null;
      thumbnail: ExternalBlob | null;
      youtubeUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateVideoProject(id, title, description, video, thumbnail, youtubeUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}

export function useUpdateThumbnail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      thumbnail,
    }: {
      id: string;
      thumbnail: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateThumbnail(id, thumbnail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}

export function useDeleteVideoProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteVideoProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}

export function useToggleVideoVisibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, visible }: { id: string; visible: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.toggleVideoVisibility(id, visible);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}

export function useSetContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      tel,
      socialMedia,
    }: {
      email: string;
      tel: string;
      socialMedia: SocialMediaLink[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setContactInfo(email, tel, socialMedia);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
  });
}

export function useUpdateVideoOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: string[]) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateVideoOrder(newOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoProjects'] });
      queryClient.invalidateQueries({ queryKey: ['allVideoProjects'] });
    },
  });
}
