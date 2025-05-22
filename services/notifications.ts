import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification behavior
// Notifications.setNotificationHandler({
//   handleNotification: () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// Request notification permissions
export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web platform');
    return { status: 'denied' };
  }
  
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    return await Notifications.requestPermissionsAsync();
  }
  return { status };
}

// Check if notifications are available and permissions granted
export async function checkNotificationsCompat() {
  if (Platform.OS === 'web') return false;
  
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

// Schedule a daily reminder at specified time
export async function scheduleDailyReminder(hour = 20, minute = 0) {
  if (Platform.OS === 'web') {
    console.log('Daily reminders not supported on web platform');
    return null;
  }
  
  if (!(await checkNotificationsCompat())) {
    console.log('Notification permissions not granted');
    return null;
  }
  
  // Cancel any existing reminders to avoid duplicates
  await cancelDailyReminder();
  
  // Configure notification channels for Android
  await configureChannels();
  
  // Schedule the daily reminder
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "💸 Daily Reminder",
      body: "Don't forget to log your expenses today!",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      sound: true,
      channelId: 'expenses',
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
}

// Cancel the daily reminder
export async function cancelDailyReminder() {
  if (Platform.OS === 'web') return;
  
  const all = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = all.filter(n => 
    n.content.title === "💸 Daily Reminder" &&
    n.content.body === "Don't forget to log your expenses today!"
  );
  
  await Promise.all(reminders.map(n => 
    Notifications.cancelScheduledNotificationAsync(n.identifier)
  ));
}

// Send an expense alert when threshold is exceeded
export async function scheduleExpenseAlert(threshold: number, currentTotal: number) {
  if (Platform.OS === 'web') {
    console.log('Expense alerts not supported on web platform');
    return null;
  }
  
  await configureChannels();
  if (!(await checkNotificationsCompat())) {
    console.log('Notification permissions not granted');
    return null;
  }
  
  // Format the currency values for better readability
  const formattedTotal = new Intl.NumberFormat('mg-MG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(currentTotal);
  
  const formattedThreshold = new Intl.NumberFormat('mg-MG', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(threshold);
  
  // Send an immediate notification
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 Expense Alert",
      body: `You've spent ${formattedTotal} Ar today (threshold: ${formattedThreshold} Ar).`,
      sound: true,
      channelId: 'expenses',
    },
    trigger: null, // null trigger means show immediately
  });
}

// Configure notification channels for Android
export async function configureChannels() {
  if (Platform.OS !== 'android') return;
  
  await Notifications.setNotificationChannelAsync('expenses', {
    name: 'Expense Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF4500',

  });
}

// Verify notifications permissions
export async function verifyPermissions() {
  if (Platform.OS === 'web') return false;
  
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  }
  return status === 'granted';
}

// Schedule a generic notification
export async function scheduleNotification(
  content: Notifications.NotificationContentInput, 
  trigger: Notifications.NotificationTriggerInput
) {
  if (Platform.OS === 'web') return null;
  
  await configureChannels();
  if (!await verifyPermissions()) return null;
  
  return Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}