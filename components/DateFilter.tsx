import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from "@/components/ui/text"
import { Combobox } from '@/components/ui/combobox';
import { Label } from "@/components/ui/label"
import { Switch } from '@/components/ui/switch';

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

interface DateFilterProps {
  onDateChange: (date: string) => void;
}

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const [selectedYear, setSelectedYear] = useState<{ value: string; label: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<{ value: string; label: string } | null>(null);
  const [selectedDay, setSelectedDay] = useState<{ value: string; label: string } | null>(null);
  const [checked, setChecked] = useState<boolean>(true);

  useEffect(() => {
    if (checked) {
      setSelectedYear(null);
      setSelectedMonth(null);
      setSelectedDay(null);
      onDateChange('')
      
    }
  }, [checked, onDateChange]);

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

  useEffect(() => {
    if (result) {
      onDateChange(result); 
    }
  }, [result, onDateChange]);

  return (
    <View className=" gap-2">
      <Text className="font-medium  text-gray-700 dark:text-gray-200">Default filter :</Text>
      <View className='justify-center gap-2 mb-2'>
        <View className='flex-row items-center gap-2'>
          <Switch checked={checked} onCheckedChange={setChecked} nativeID='all' />
          <Label nativeID='all' onPress={() => setChecked((prev) => !prev)}>
            All
          </Label>
        </View>
      </View>

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
              setChecked(false);
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
                setChecked(false);
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
              onSelectedItemChange={(val) => {
                setSelectedDay(val);
                setChecked(false);
              }}
              placeholder="Day"
            />
          </View>
        )}
      </View>
    </View>
  );
}
