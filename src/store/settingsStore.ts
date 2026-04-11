import { create } from 'zustand';

export type SettingsStore = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggleNotifications: () => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  notificationsEnabled: true,
  setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
}));
