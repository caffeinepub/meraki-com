import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Inquiry, UserProfile, Service, ContactMethod, SiteSettings } from '../types/meraki';

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getAllInquiries?.() || [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      email: string;
      phone: string | null;
      service: Service;
      preferredContactMethod: ContactMethod;
      message: string;
      consent: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (!actor.submitInquiry) {
        throw new Error('Backend method submitInquiry not yet implemented');
      }
      // @ts-ignore
      return actor.submitInquiry(
        data.fullName,
        data.email,
        data.phone,
        data.service,
        data.preferredContactMethod,
        data.message,
        data.consent
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      return actor.getCallerUserProfile?.() || null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (!actor.saveCallerUserProfile) {
        throw new Error('Backend method saveCallerUserProfile not yet implemented');
      }
      // @ts-ignore
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteSettings | null>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) return null;
      // @ts-ignore - Backend method not yet implemented
      return actor.getSiteSettings?.() || null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      if (!actor.updateSiteSettings) {
        throw new Error('Backend method updateSiteSettings not yet implemented');
      }
      // @ts-ignore
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}

export function useGetProjectExportUrl() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['projectExportUrl'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProjectExportUrl();
    },
    enabled: false, // Manual trigger only via refetch
    retry: false,
    staleTime: 0, // Always fetch fresh
    gcTime: 0, // Don't cache
  });
}
