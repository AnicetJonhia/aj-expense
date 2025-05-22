import React, { useEffect, useState } from 'react';
import { View, ScrollView, Platform, Alert} from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; 
import { useExpenseStore } from '@/store/useExpenseStore';
import ExportDialog from '@/components/settings/ExportDialog';
import ResetDataDialog from '@/components/settings/ResetDataDialog';
import { useColorScheme } from '@/hooks/useColorScheme';
import ThresholdDialog from '@/components/settings/ThresholdDialog';
import ReminderTimeDialog from '@/components/settings/ReminderTimeDialog';
import { useSettingsStore } from '@/store/useSettingsStore';
import { requestNotificationPermissions } from '@/services/notifications';

export default function SettingsScreen() {
  const { fetchExpenses } = useExpenseStore();
  const { 
    expenseAlertEnabled,
    dailyReminderEnabled,
    reminderTime,
    setExpenseAlertEnabled,
    setDailyReminderEnabled,
    loadSettings
  } = useSettingsStore();

  const { colorScheme, setColorScheme } = useColorScheme();

  // Local state
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [thresholdOpen, setThresholdOpen] = useState<boolean>(false);
  const [reminderTimeOpen, setReminderTimeOpen] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    setIsDark(colorScheme === 'dark')
  }, [colorScheme]);

  // Load initial data
  useEffect(() => {
    const initialize = async () => {
      await loadSettings();
      await fetchExpenses();
      
      if (Platform.OS !== 'web') {
        const { status } = await requestNotificationPermissions();
        setPermissionStatus(status);
      }
    };
    
    initialize();
  }, []);

  const handleDailyReminder = async (enabled: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert('Notifications are not supported on web');
      return;
    }
    
    try {
      if (permissionStatus !== 'granted') {
        const { status } = await requestNotificationPermissions();
        setPermissionStatus(status);
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Notification permission is required for reminders. Please enable notifications for this app in your device settings.'
          );
          return;
        }
      }
      
      await setDailyReminderEnabled(enabled);
      if (enabled) {
        setReminderTimeOpen(true);
      }
    } catch (error) {
      console.error('Error with daily reminder:', error);
      Alert.alert('Error', 'Failed to set daily reminder. Please try again.');
    }
  };

  const handleExpenseAlert = async (enabled: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert('Notifications are not supported on web');
      return;
    }
    
    try {
      if (permissionStatus !== 'granted' && enabled) {
        const { status } = await requestNotificationPermissions();
        setPermissionStatus(status);
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Notification permission is required for alerts. Please enable notifications for this app in your device settings.'
          );
          return;
        }
      }
      
      await setExpenseAlertEnabled(enabled);
      
      if (enabled) {
        setThresholdOpen(true);
      }
    } catch (error) {
      console.error('Error with expense alert:', error);
      Alert.alert('Error', 'Failed to set expense alert. Please try again.');
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      setColorScheme(next ? 'dark' : 'light');
      return next;
    });
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  return (
    <>
    <View className="flex-1 p-4 gap-4 bg-white dark:bg-black">
      <View className="border-b border-gray-300 dark:border-gray-600 pb-2">
        <Text className="text-2xl font-bold text-primary">⚙️ Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text className="text-lg font-semibold text-primary mt-2 mb-2">Appearance</Text>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <View className='flex-1'>
              <Label nativeID="mode-label" onPress={toggleTheme}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Label>
            </View>
            <View className='"ml-auto'>
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                nativeID="mode-switch"
              />
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Notifications</Text>
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <View className='flex-1'>
              <Label nativeID='daily-reminder'>Daily Reminder</Label>
              <Text className="text-xs mt-2 text-gray-500">
                Receive a reminder at {formatTime(reminderTime.hour, reminderTime.minute)}
              </Text>
            </View>
            <View className='ml-auto flex-row items-center gap-2'>
              {dailyReminderEnabled && (
                <Button
                  variant="ghost"
                  onPress={() => setReminderTimeOpen(true)}
                   className="border border-dashed border-gray-300 dark:border-gray-600  px-2 py-1"
                >
                  <Text className="text-sm">Edit Time</Text>
                </Button>
              )}
              <Switch
                nativeID="daily-reminder"
                checked={dailyReminderEnabled}
                onCheckedChange={handleDailyReminder}
                disabled={Platform.OS === 'web'}
              />
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <View className='flex-1'>
              <Label nativeID='expense-alert'>Expense Alerts</Label>
              <Text className="text-xs mt-2 text-gray-500">
                Get notified when daily expenses exceed your threshold
              </Text>
            </View>
            <View className='ml-auto flex-row items-center gap-2'>
              {expenseAlertEnabled && (
                <Button
                  variant="ghost"
                  onPress={() => setThresholdOpen(true)}
                   className="border border-dashed border-gray-300 dark:border-gray-600 px-2 py-1"
                >
                  <Text className="text-sm">Edit thresold</Text>
                </Button>
              )}
              <Switch 
                nativeID='expense-alert'
                checked={expenseAlertEnabled}
                onCheckedChange={handleExpenseAlert}
                disabled={Platform.OS === 'web'}
              />
            </View>
          </View>
        </View>

        {/* Data Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Data & Storage</Text>
        <View className="gap-2">
          <Button variant="outline" onPress={() => setExportOpen(true)}>
            <Text>Export Data</Text>
          </Button>
          <Button variant="destructive" onPress={() => setResetOpen(true)}>
            <Text>Reset Data</Text>
          </Button>
        </View>

        {/* Support Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Support</Text>
        <View className="gap-2 mb-8">
          <Button variant="outline">
            <Text>Send Feedback</Text>
          </Button>
          <Button variant="outline">
            <Text>Privacy Policy</Text>
          </Button>
          <Button variant="outline">
            <Text>App Version</Text>
          </Button>
        </View>
      </ScrollView>

     
    </View>
    
     <ThresholdDialog
        isOpen={thresholdOpen}
        setIsOpen={setThresholdOpen}
      />

      <ReminderTimeDialog
        isOpen={reminderTimeOpen}
        setIsOpen={setReminderTimeOpen}
      />

      <ResetDataDialog
        isOpen={resetOpen}
        setIsOpen={setResetOpen}
      />

      <ExportDialog
        isOpen={exportOpen}
        setIsOpen={setExportOpen}
      />
    </>
  );
}