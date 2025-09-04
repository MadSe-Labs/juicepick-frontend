import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types/profile';
import { MOCK_USER_PROFILES } from '@/lib/mockData';

interface ProfileStore {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  getProfileById: (id: string) => UserProfile | undefined;
  updateProfile: (id: string, updates: Partial<UserProfile>) => void;
  setCurrentProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: MOCK_USER_PROFILES,
      currentProfile: null,

      getProfileById: (id: string) => {
        const { profiles } = get();
        return profiles.find((profile) => profile.id === id);
      },

      updateProfile: (id: string, updates: Partial<UserProfile>) => {
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === id ? { ...profile, ...updates } : profile
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates }
              : state.currentProfile,
        }));
      },

      setCurrentProfile: (profile: UserProfile | null) => {
        set({ currentProfile: profile });
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);
