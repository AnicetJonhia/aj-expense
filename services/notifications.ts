import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Demande les permissions (à lancer une seule fois)
export async function requestNotificationPermissions() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

// Planifier le rappel quotidien
export async function scheduleDailyReminder() {
  // on pourrait stocker l’ID renvoyé pour l’annuler plus tard
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "💸 Daily Reminder",
      body: "Don't forget to log your expenses today!",
    },
    trigger: {
      hour: 21,
      minute: 42,
      repeats: true,
    },
  });
}

// Annuler les rappels quotidiens (ici on annule tout, ou tu peux conserver l’ID)
export async function cancelDailyReminder() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(all.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

// Planifier une alerte de budget
export async function scheduleExpenseAlert(threshold: number) {
  // Exemple : envoie immédiatement pour la démo, mais tu peux adapter
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 Expense Alert",
      body: `An expense exceeded your threshold of ${threshold} Ar!`,
    },
    trigger: null,
  });
}
