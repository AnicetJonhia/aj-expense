import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { HeaderRight } from "@/components/HeaderRight";
import { View, useWindowDimensions } from 'react-native';
import '@/global.css';
import Toast from 'react-native-toast-message';


export default function RootLayout() {
  const { width } = useWindowDimensions();

  return (
    <ThemeProvider>
      <StatusBar />
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
      <Toast  />

    </ThemeProvider>
  );
}
