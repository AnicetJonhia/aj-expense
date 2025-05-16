// services/notifications.ts
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Demande la permission (à appeler une fois, p.ex. au lancement de l’app)
export async function requestNotificationPermissions() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

// Rappel quotidien à 20h00
export async function scheduleDailyReminder() {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "💸 Daily Reminder",
      body: "Don't forget to log your expenses today!",
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
  await Promise.all(all.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

// Notification d’alerte de seuil (immédiate)
export async function scheduleExpenseAlert(threshold: number, currentTotal: number) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 Expense Alert",
      body: `You've spent ${currentTotal} Ar today (threshold: ${threshold}).`,
      sound: true,
    },
    trigger: null,
  });
}
