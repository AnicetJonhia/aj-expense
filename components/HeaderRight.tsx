
import { useColorScheme } from "nativewind";
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/constants/Colors';

export function HeaderRight() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const tintColor = Colors[colorScheme ?? 'light'].tint;
  
  const isDark = colorScheme === 'dark';

    useEffect(() => {
      setColorScheme('dark');
    }, []);
  
    const toggleColorScheme = () => {
      setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
    };

  return (
    <Pressable onPress={toggleColorScheme} style={{ padding: 10 }}>
      <FontAwesome color={tintColor} name={isDark ? 'sun-o' : 'moon-o'} size={20} />
    </Pressable>
  );
}
