import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; 
import { useColorScheme } from 'nativewind';
import { useExpenseStore } from '@/store/useExpenseStore';
import  ExportDialog  from '@/components/settings/ExportDialog';
import ResetDataDialog from '@/components/settings/ResetDataDialog';

export default function SettingsScreen() {
   const { fetchExpenses } = useExpenseStore();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [checked, setChecked] = useState(isDark);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [exportOpen, setExportOpen] = useState<boolean>(false)


  useEffect(() => {
      fetchExpenses();
    }, []);



  const toggleColorScheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setColorScheme(newMode);
    setChecked(!isDark);
  };

  return (
    <View className="flex-1 p-4 gap-4 bg-white dark:bg-black">
      <View className="border-b border-gray-300 dark:border-gray-600 pb-2">
        <Text className="text-2xl font-bold text-primary">⚙️ Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <Text className="text-lg font-semibold text-primary mt-2 mb-2">Appearance</Text>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Switch checked={checked} onCheckedChange={toggleColorScheme} nativeID="mode" />
            <Label nativeID="mode" onPress={toggleColorScheme}>
              {checked ? 'Dark Mode' : 'Light Mode'}
            </Label>
          </View>
        </View>

        {/* Notifications Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Notifications</Text>
        <View className=" gap-2">
          <Button variant="outline">
            <Text>Daily Reminder</Text>
          </Button>
          <Button variant="outline">
            <Text>Expense Alerts</Text>
          </Button>
        </View>

        {/* Data Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Data & Storage</Text>
        <View className="gap-2">
          <Button variant="outline" onPress={() => setExportOpen(true)}>
            <Text>Export Data</Text>
          </Button>
          <Button variant="destructive" onPress={() =>setResetOpen(true)}>
            <Text>Reset Data</Text>
          </Button>
        </View>

        {/* Support Section */}
        <Text className="text-lg font-semibold text-primary mt-6 mb-2">Support</Text>
        <View className="gap-2 mb-8">
          <Button variant="outline">
            <Text>Send Feedback</Text>
          </Button>
          <Button variant="outline">
            <Text>Privacy Policy</Text>
          </Button>
          <Button variant="outline">
            <Text>App Version</Text>
          </Button>
        </View>
      </ScrollView>


     
      <ResetDataDialog
          isOpen={resetOpen}
          setIsOpen={setResetOpen}
      
        />



        <ExportDialog
              isOpen={exportOpen}
              setIsOpen={setExportOpen}
            />
                       
    </View>
  );
}
