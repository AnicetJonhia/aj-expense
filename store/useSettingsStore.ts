import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsStore = {
  expenseAlertEnabled: boolean;
  alertThreshold: number;
  dailyReminderEnabled: boolean;
  setExpenseAlertEnabled: (enabled: boolean) => Promise<void>;
  setAlertThreshold: (threshold: number) => Promise<void>;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  expenseAlertEnabled: false,
  alertThreshold: 1000,
  dailyReminderEnabled: false,

  loadSettings: async () => {
    const [enabled, threshold, daily] = await Promise.all([
      AsyncStorage.getItem('expenseAlertEnabled'),
      AsyncStorage.getItem('alertThreshold'),
      AsyncStorage.getItem('dailyReminderEnabled'),
    ]);
    
    set({
      expenseAlertEnabled: enabled === 'true',
      alertThreshold: threshold ? Number(threshold) : 1000,
      dailyReminderEnabled: daily === 'true',
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

  setDailyReminderEnabled: async (enabled) => {
    await AsyncStorage.setItem('dailyReminderEnabled', enabled.toString());
    set({ dailyReminderEnabled: enabled });
  },
}));