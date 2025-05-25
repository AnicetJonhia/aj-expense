
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import TabHeader from '@/components/TabHeader';
import Global from '@/components/dashboard/Global';
import DateFilter from '@/components/dashboard/DateFilter';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import CategoryFilter from '@/components/dashboard/CategoryFilter';
import {Separator} from "@/components/ui/separator"

export default function DashboardScreen() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [dateString, setDateString] = useState<string>('')

  return (
    <>
    <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
    <TabHeader title={"🏠 Dashboard"} onAddPress={() => setIsAddOpen(true)} />
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 gap-2 ">
      <Global/>
      <Separator className="mt-4"/>
    
      <DateFilter  onChange={(date: string) => {
     
          setDateString(date)
        }}/>
           <Separator/>
        <CategoryFilter dateString={dateString} />
        <Separator className='mt-4'/>
    </ScrollView>
    </View>
     <AddExpenseDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </>

  );
}
