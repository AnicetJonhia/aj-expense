import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Text } from '@/components/ui/text';
import { ThemeProvider } from "@/hooks/ThemeProvider";
import { HeaderRight } from "@/components/HeaderRight";
import '@/global.css'

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerTitle: () => <Text  style={{ fontSize: 18, fontWeight: 'bold' }}>AJExpense</Text>,
            headerRight: () => <HeaderRight />,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
