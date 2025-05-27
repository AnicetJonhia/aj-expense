

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView 
    style={{ flex: 1 }}
    edges={['bottom']} 
    >
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: 'blue',
      headerShown: false,
      tabBarStyle: {
        height: 64, 
        paddingBottom: 8,
        paddingTop: 4,
        position: 'relative', 
        borderTopWidth: 2, 
      
        elevation: 0, 
        shadowOpacity: 0, 

        
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 4,
      },
      tabBarItemStyle: {
        height: 48, 
      },
    }}
  >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: 'Expense',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="line-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
