// ToastContent.tsx
import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Text } from '@/components/ui/text';

export function ToastContent({
  type,
  text1,
  text2,
}: {
  type: 'success' | 'error';
  text1: string;
  text2?: string;
}) {
  const { colorScheme } = useColorScheme();

  const isSuccess = type === 'success';
  const bgClass = isSuccess
    ? colorScheme === 'dark'
      ? 'bg-green-900 border-green-700'
      : 'bg-green-100 border-green-300'
    : colorScheme === 'dark'
    ? 'bg-red-900 border-red-700'
    : 'bg-red-100 border-red-300';

  const textColor = isSuccess
    ? 'text-green-700 dark:text-green-200'
    : 'text-red-700 dark:text-red-200';

  const subTextColor = isSuccess
    ? 'text-green-700 dark:text-green-300'
    : 'text-red-700 dark:text-red-300';

  return (
    <View className={`w-[90%] px-4 py-3 rounded-lg border ${bgClass}`}>
      <Text className={`text-base font-semibold ${textColor}`}>{text1}</Text>
      {text2 ? <Text className={`text-sm ${subTextColor}`}>{text2}</Text> : null}
    </View>
  );
}
