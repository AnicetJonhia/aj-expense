
import * as Notifications from 'expo-notifications';



export async function requestNotificationPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    return await Notifications.requestPermissionsAsync();
  }
  return { status };
}

async function checkNotificationsCompat() {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyReminder() {
  if (!(await checkNotificationsCompat())) return;

  
  await cancelDailyReminder();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "💸 Daily Reminder",
      body: "Don't forget to log your expenses today!",
      priority: Notifications.AndroidNotificationPriority.HIGH,
      channelId: 'expenses',
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
}


export async function cancelDailyReminder() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = all.filter(n => 
    n.content.title === "💸 Daily Reminder" &&
    n.content.body === "Don't forget to log your expenses today!"
  );
  await Promise.all(reminders.map(n => 
    Notifications.cancelScheduledNotificationAsync(n.identifier)
  ));
}

export async function scheduleExpenseAlert(threshold: number, currentTotal: number) {
  await configureChannels();
  if (!(await verifyPermissions())) return;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 Expense Alert",
      body: `You've spent ${currentTotal} Ar today (threshold: ${threshold} Ar).`,
      sound: true,
      channelId: 'expenses',
    },
    trigger: null,
  });
}





// Configurer les canaux Android
export async function configureChannels() {
  await Notifications.setNotificationChannelAsync('expenses', {
    name: 'Expense Alerts',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

// Vérifier les permissions
export async function verifyPermissions() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
  return status === 'granted';
}

// Planifier une notification
export async function scheduleNotification(content: Notifications.NotificationContentInput, trigger: Notifications.NotificationTriggerInput) {
  await configureChannels();
  if (!await verifyPermissions()) return;
  
  return Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}