import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder, cancelDailyReminder } from '@/services/notifications';
import { Platform } from 'react-native';

type SettingsStore = {
  // Notification settings
  expenseAlertEnabled: boolean;
  alertThreshold: number;
  dailyReminderEnabled: boolean;
  
  // Loading state
  isLoading: boolean;
  
  // Action methods
  setExpenseAlertEnabled: (enabled: boolean) => Promise<void>;
  setAlertThreshold: (threshold: number) => Promise<void>;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  expenseAlertEnabled: false,
  alertThreshold: 100000,
  dailyReminderEnabled: false,
  isLoading: true,
  
  loadSettings: async () => {
    set({ isLoading: true });
    
    try {
      const [enabled, threshold, daily] = await Promise.all([
        AsyncStorage.getItem('expenseAlertEnabled'),
        AsyncStorage.getItem('alertThreshold'),
        AsyncStorage.getItem('dailyReminderEnabled'),
      ]);
      
      const parsedThreshold = threshold ? Number(threshold) : 100000;
      const alertEnabled = enabled === 'true';
      const reminderEnabled = daily === 'true';
      
      set({
        expenseAlertEnabled: alertEnabled,
        alertThreshold: parsedThreshold,
        dailyReminderEnabled: reminderEnabled,
      });
      
      // If daily reminder is enabled, schedule it
      if (reminderEnabled && Platform.OS !== 'web') {
        scheduleDailyReminder().catch(err => 
          console.error('Failed to schedule reminder on load:', err)
        );
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  setExpenseAlertEnabled: async (enabled) => {
    try {
      await AsyncStorage.setItem('expenseAlertEnabled', enabled.toString());
      set({ expenseAlertEnabled: enabled });
      
      // If disabling alerts, don't change threshold - user might want to keep the value
    } catch (error) {
      console.error('Failed to save expense alert setting:', error);
    }
  },
  
  setAlertThreshold: async (threshold) => {
    try {
      if (isNaN(threshold) || threshold <= 0) {
        threshold = 100000; // Default value if invalid
      }
      
      await AsyncStorage.setItem('alertThreshold', threshold.toString());
      set({ alertThreshold: threshold });
    } catch (error) {
      console.error('Failed to save alert threshold:', error);
    }
  },
  
  setDailyReminderEnabled: async (enabled) => {
    try {
      await AsyncStorage.setItem('dailyReminderEnabled', enabled.toString());
      set({ dailyReminderEnabled: enabled });
      
      // Schedule or cancel reminder based on new setting
      if (Platform.OS !== 'web') {
        if (enabled) {
          await scheduleDailyReminder();
        } else {
          await cancelDailyReminder();
        }
      }
    } catch (error) {
      console.error('Failed to save daily reminder setting:', error);
    }
  },
}));