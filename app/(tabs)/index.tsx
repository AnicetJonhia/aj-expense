
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import TabHeader from '@/components/TabHeader';
import GlobalDashboard from '@/components/GlobalDashboard';
import DashboardDateFilter from '@/components/DashboardDateFilter';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import DashboardCategoryFilter from '@/components/DashboardCategoryFilter';
import {Separator} from "@/components/ui/separator"

export default function DashboardScreen() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [dateString, setDateString] = useState<string>('')

  return (
    <>
    <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
    <TabHeader title={"🏠 Dashboard"} onAddPress={() => setIsAddOpen(true)} />
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-2 ">
      <GlobalDashboard/>
      <Separator className="mt-4"/>
    
      <DashboardDateFilter  onChange={(date: string) => {
          
          setDateString(date)
        }}/>
           <Separator/>
        <DashboardCategoryFilter dateString={dateString} />
        <Separator/>
    </ScrollView>
    </View>
     <AddExpenseDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </>

  );
}
