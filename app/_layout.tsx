import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { HeaderRight } from "@/components/HeaderRight";
import { View ,Platform} from 'react-native';
import '@/global.css';
import Toast from 'react-native-toast-message';
import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { useEffect, } from 'react';


export default function RootLayout() {

  useEffect(() => {
  
    if (Platform.OS === 'ios') {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
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
