import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "nativewind";
import React, { useEffect } from 'react';
import { View } from 'react-native';


export default function SettingsScreen() {

  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme('dark');
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-primary">Hello World 👋</Text>

      <Button onPress={toggleColorScheme}>
      <Text>Toggle theme (Current: {colorScheme})</Text>
      </Button>
    </View>
  );
}