import React, { useState } from 'react';
import { View} from 'react-native';
import {Text} from "@/components/ui/text"
import { Combobox } from '@/components/ui/combobox'; 


const years = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: `${year}`, label: `${year}` };
});

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((m, i) => ({
  value: `${i + 1}`.padStart(2, '0'),
  label: m,
}));

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function DateSelectorScreen() {
  const [selectedYear, setSelectedYear] = useState<{ value: string; label: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<{ value: string; label: string } | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ value: string; label: string } | null>(null);

  const days =
    selectedYear && selectedMonth
      ? Array.from({ length: getDaysInMonth(Number(selectedYear.value), Number(selectedMonth.value)) }, (_, i) => ({
          value: `${i + 1}`.padStart(2, '0'),
          label: `${i + 1}`,
        }))
      : [];

  const result = selectedYear
    ? selectedMonth
      ? selectedDay
        ? `${selectedYear.value}-${selectedMonth.value}-${selectedDay.value}`
        : `${selectedYear.value}-${selectedMonth.value}`
      : `${selectedYear.value}`
    : '';

  return (
    <View className="flex-1 justify-center px-6 space-y-6">
      <Text className="font-medium text-gray-700 dark:text-gray-200">Select Date :</Text>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <Combobox 
            items={years}
            selectedItem={selectedYear}
            onSelectedItemChange={(val) => {
              setSelectedYear(val);
              setSelectedMonth(null);
              setSelectedDay(null);
            }}
            placeholder="Year"
          />
        </View>
        {selectedYear && (
          <View className="flex-1">
          <Combobox
            items={months}
            selectedItem={selectedMonth}
            onSelectedItemChange={(val) => {
              setSelectedMonth(val);
              setSelectedDay(null);
            }}
            placeholder="Month"
          />
        </View>
        )}
        {selectedMonth && (
          <View className="flex-1">
          <Combobox
            items={days}
            selectedItem={selectedDay}
            onSelectedItemChange={setSelectedDay}
            placeholder="Day"
          />
        </View>
        )}
      </View>

      <Text className="text-center mt-6 text-lg font-semibold text-gray-800 dark:text-white">
        {result || 'Select a date'}
      </Text>
</View>

  );
}
