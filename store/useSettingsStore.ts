import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder, cancelDailyReminder } from '@/services/notifications';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

type SettingsStore = {
  // Notification settings
  expenseAlertEnabled: boolean;
  alertThreshold: number;
  dailyReminderEnabled: boolean;
  reminderTime: {
    hour: number;
    minute: number;
  };
  
  // Loading state
  isLoading: boolean;
  
  // Action methods
  setExpenseAlertEnabled: (enabled: boolean) => Promise<void>;
  setAlertThreshold: (threshold: number) => Promise<void>;
  setDailyReminderEnabled: (enabled: boolean) => Promise<void>;
  setReminderTime: (hour: number, minute: number) => Promise<void>;
  loadSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  expenseAlertEnabled: false,
  alertThreshold: 100000,
  dailyReminderEnabled: false,
  reminderTime: {
    hour: 20,
    minute: 0
  },
  isLoading: true,
  
  loadSettings: async () => {
    set({ isLoading: true });
    
    try {
      const [enabled, threshold, daily, reminderTime] = await Promise.all([
        AsyncStorage.getItem('expenseAlertEnabled'),
        AsyncStorage.getItem('alertThreshold'),
        AsyncStorage.getItem('dailyReminderEnabled'),
        AsyncStorage.getItem('reminderTime'),
      ]);
      
      const parsedThreshold = threshold ? Number(threshold) : 100000;
      const alertEnabled = enabled === 'true';
      const reminderEnabled = daily === 'true';
      const parsedTime = reminderTime ? JSON.parse(reminderTime) : { hour: 20, minute: 0 };
      
      set({
        expenseAlertEnabled: alertEnabled,
        alertThreshold: parsedThreshold,
        dailyReminderEnabled: reminderEnabled,
        reminderTime: parsedTime,
      });
      
      // Only schedule reminder if it's not already scheduled
      if (reminderEnabled && Platform.OS !== 'web') {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        const hasReminder = scheduledNotifications.some(n => 
          n.content.title === "💸 Daily Reminder" &&
          n.content.body === "Don't forget to log your expenses today!" 
        );
        
        if (!hasReminder) {
          scheduleDailyReminder(parsedTime.hour, parsedTime.minute).catch(err => 
            console.error('Failed to schedule reminder on load:', err)
          );
        }
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
    } catch (error) {
      console.error('Failed to save expense alert setting:', error);
    }
  },
  
  setAlertThreshold: async (threshold) => {
    try {
      if (isNaN(threshold) || threshold <= 0) {
        threshold = 100000;
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
          const { reminderTime } = get();
          await scheduleDailyReminder(reminderTime.hour, reminderTime.minute);
        } else {
          await cancelDailyReminder();
        }
      }
    } catch (error) {
      console.error('Failed to save daily reminder setting:', error);
    }
  },

  setReminderTime: async (hour: number, minute: number) => {
    try {
      const newTime = { hour, minute };
      await AsyncStorage.setItem('reminderTime', JSON.stringify(newTime));
      set({ reminderTime: newTime });
      
      // Reschedule reminder if enabled
      const { dailyReminderEnabled } = get();
      if (dailyReminderEnabled && Platform.OS !== 'web') {
        await scheduleDailyReminder(hour, minute);
      }
    } catch (error) {
      console.error('Failed to save reminder time:', error);
    }
  },
}));
