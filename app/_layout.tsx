import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { HeaderRight } from "@/components/HeaderRight";
import { View, useWindowDimensions } from 'react-native';
import '@/global.css';

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
              <View style={{ maxWidth: width - 120 }}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 18, fontWeight: 'bold' }}
                >
                  AJExpense
                </Text>
              </View>
            ),
            headerRight: () => (
              <View style={{ paddingRight: 10 }}>
                <HeaderRight />
              </View>
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
