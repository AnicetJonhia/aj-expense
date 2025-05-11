
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import TabHeader from '@/components/TabHeader';
import GlobalDashboard from '@/components/GlobalDashboard';
import DashboardFiltration from '@/components/DashboardFiltration';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';


export default function DashboardScreen() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  return (
    <>
    <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
    <TabHeader title={"Dashboard"} onAddPress={() => setIsAddOpen(true)} />
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 py-2 ">
      <GlobalDashboard/>
      <DashboardFiltration/>
    </ScrollView>
    </View>
     <AddExpenseDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </>

  );
}
