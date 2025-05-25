
import React, { useEffect, useState } from 'react';
import { View, } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Global() {
  const { items, fetchExpenses } = useExpenseStore();
  const [totals, setTotals] = useState({
    year: 0,
    month: 0,
    day: 0,
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const now = new Date();
    const Y = now.getFullYear();
    const M = now.getMonth();
    const D = now.getDate();

    let sumYear = 0,
        sumMonth = 0,
        sumDay = 0;

    items.forEach(exp => {
      const dt = new Date(exp.date);
      if (dt.getFullYear() === Y) {
        sumYear += exp.amount;
        if (dt.getMonth() === M) {
          sumMonth += exp.amount;
          if (dt.getDate() === D) {
            sumDay += exp.amount;
          }
        }
      }
    });

    setTotals({ year: sumYear, month: sumMonth, day: sumDay });
  }, [items]);

  const now = new Date();

  return (
    <>
      <Text className="text-2xl font-bold mb-4">Global</Text>


      <View className="flex-row justify-between gap-2 mb-4">

        <Card className="flex-1 bg-gray-100 dark:bg-gray-900">
          <CardContent className="p-4">
            <View className="flex-row gap-2 items-center">
            <Text><FontAwesome name="calendar" size={18}  /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {format(now, 'yyyy')}
              </Text>
              
            </View>
            <Text className="text-xl font-bold text-primary">
              {totals.year} Ar
            </Text>
          </CardContent>
        </Card>

      
        <Card className="flex-1 bg-gray-100 dark:bg-gray-900">
          <CardContent className="p-4">
            <View className="flex-row gap-2 items-center">
            <Text><FontAwesome name="calendar-o" size={18}  /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {format(now, 'MMMM, yyyy')}
              </Text>
              
            </View>
            <Text className="text-xl font-bold text-primary">
              {totals.month} Ar
            </Text>
          </CardContent>
        </Card>
      </View>



        <Card className="bg-gray-100 dark:bg-gray-900">
          <CardContent className="p-4">
            <View className="flex-row gap-2 items-center">
            <Text><FontAwesome name="calendar-check-o" size={18} /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {format(now, 'MMMM do, yyyy')}
              </Text>
              
            </View>
            <Text className="text-xl font-bold text-primary">
              {totals.day} Ar
            </Text>
          </CardContent>
        </Card>
 
      </>

  );
}
