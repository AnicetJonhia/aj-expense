
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsStore = {
  expenseAlertEnabled: boolean;
  alertThreshold: number;
  setExpenseAlertEnabled: (enabled: boolean) => Promise<void>;
  setAlertThreshold: (threshold: number) => Promise<void>;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  expenseAlertEnabled: false,
  alertThreshold: 1000,

  loadSettings: async () => {
    const enabled = await AsyncStorage.getItem('expenseAlertEnabled');
    const threshold = await AsyncStorage.getItem('alertThreshold');
    set({
      expenseAlertEnabled: enabled === 'true',
      alertThreshold: threshold ? Number(threshold) : 1000,
    });
  },

  setExpenseAlertEnabled: async (enabled) => {
    await AsyncStorage.setItem('expenseAlertEnabled', enabled.toString());
    set({ expenseAlertEnabled: enabled });
  },

  setAlertThreshold: async (threshold) => {
    await AsyncStorage.setItem('alertThreshold', threshold.toString());
    set({ alertThreshold: threshold });
  },
}));