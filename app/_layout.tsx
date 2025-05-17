import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Text } from '@/components/ui/text';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { HeaderRight } from "@/components/HeaderRight";
import { View } from 'react-native';
import '@/global.css';
import Toast from 'react-native-toast-message';
import { PortalHost } from '@rn-primitives/portal';
import React , {useEffect} from 'react';
import Notifications from "expo-notifications";


export default function RootLayout() {
  useEffect(() => {
    const setupChannels = async () => {
      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name:'Daily reminder',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });

      await Notifications.setNotificationChannelAsync('expense-alerts', {
        name: 'Expense Alert',
        importance: Notifications.AndroidImportance.MAX,
  
      });
    };
  
      setupChannels();
    }, []);
  

  return (
    <ThemeProvider>
      <StatusBar translucent style="auto" />
      <Stack>
      <Stack.Screen
      name="(tabs)"
      options={{
        headerTitle: () => (
          <View className="flex-row items-center w-full px-4">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="font-bold"
            >
              AJExpense
            </Text>
            <View className="ml-auto">
              <HeaderRight />
            </View>
          </View>
        ),
        headerTitleAlign: 'left',
      }}
    />

        <Stack.Screen name="+not-found" />
      </Stack>
      <PortalHost />
      <Toast  />

    </ThemeProvider>
  );
}
