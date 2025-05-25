import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';

interface DateFilterProps {
  onDateChange: (filters: { date?: string; category?: string }) => void;
}

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const { items, fetchExpenses } = useExpenseStore();

  const [checked, setChecked] = useState(true);
  const [year, setYear] = useState('all');
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);


  const years = useMemo(() => {
    const setY = new Set(items.map(i => new Date(i.date).getFullYear()));
    return [
      { label: 'All Years', value: 'all' },
      ...[...setY].sort((a, b) => b - a).map(y => ({
        label: String(y),
        value: String(y),
      })),
    ];
  }, [items]);

  const months = useMemo(() => {
    if (year === 'all') return [];
    const setM = new Set(
      items
        .filter(i => new Date(i.date).getFullYear() === Number(year))
        .map(i => new Date(i.date).getMonth() + 1)
    );
    return [...setM]
      .sort((a, b) => a - b)
      .map(m => ({
        label: format(new Date(Number(year), m - 1, 1), 'MMMM'),
        value: String(m).padStart(2, '0'),
      }));
  }, [items, year]);

  const days = useMemo(() => {
    if (year === 'all' || !month) return [];
    const m0 = Number(month) - 1;
    const setD = new Set(
      items
        .filter(i => {
          const d = new Date(i.date);
          return d.getFullYear() === Number(year) && d.getMonth() === m0;
        })
        .map(i => new Date(i.date).getDate())
    );
    return [...setD]
      .sort((a, b) => a - b)
      .map(dy => ({
        label: String(dy),
        value: String(dy).padStart(2, '0'),
      }));
  }, [items, year, month]);


  const filteredByDate = useMemo(() => {
    if (year === 'all') return items;
    return items.filter(i => {
      const d = new Date(i.date);
      if (String(d.getFullYear()) !== year) return false;
      if (month && String(d.getMonth() + 1).padStart(2, '0') !== month) return false;
      if (day && String(d.getDate()).padStart(2, '0') !== day) return false;
      return true;
    });
  }, [items, year, month, day]);


  const categories = useMemo(() => {
    const setC = new Set(filteredByDate.map(i => i.category));
    return [...setC]
      .sort()
      .map(cat => ({ label: cat, value: cat }));
  }, [filteredByDate]);

  
  useEffect(() => {
    if (selectedCategory && !categories.some(c => c.value === selectedCategory)) {
      setSelectedCategory(null);
    }
  }, [categories, selectedCategory]);


  const dateString = useMemo(() => {
    if (year === 'all') return '';
    if (!month) return year;
    if (!day) return `${year}-${month}`;
    return `${year}-${month}-${day}`;
  }, [year, month, day]);


  useEffect(() => {
    if (checked) {
      onDateChange({ date: '', category: '' });
    } else {
      onDateChange({ date: dateString, category: selectedCategory || '' });
    }
  }, [checked, dateString, selectedCategory, onDateChange]);

  return (
    <View className="gap-2">

      <View className="flex-row items-center gap-2">
        <Switch checked={checked} onCheckedChange={setChecked} nativeID="all" />
        <Label nativeID="all" onPress={() => setChecked(prev => !prev)}>
          All
        </Label>
      </View>


      <Label>Filter by date:</Label>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Combobox
            items={years}
            selectedItem={years.find(y => y.value === year) || null}
            onSelectedItemChange={opt => {
              setYear(opt.value);
              setMonth(null);
              setDay(null);
              setChecked(false);
            }}
            placeholder="Year"
          />
        </View>
        {year !== 'all' && (
          <View className="flex-1">
            <Combobox
              items={months}
              selectedItem={months.find(m => m.value === month) || null}
              onSelectedItemChange={opt => {
                setMonth(opt.value);
                setDay(null);
                setChecked(false);
              }}
              placeholder="Month"
              disabled={checked}
            />
          </View>
        )}
        {month && (
          <View className="flex-1">
            <Combobox
              items={days}
              selectedItem={days.find(d => d.value === day) || null}
              onSelectedItemChange={opt => {
                setDay(opt.value);
                setChecked(false);
              }}
              placeholder="Day"
              disabled={checked}
            />
          </View>
        )}
      </View>

  
      <Label>Filter by category:</Label>
      <Combobox
        items={categories}
        selectedItem={
          selectedCategory ? { label: selectedCategory, value: selectedCategory } : null
        }
        onSelectedItemChange={opt => {
          setSelectedCategory(opt.value);
          setChecked(false);
        }}
        placeholder="Select category"
      />
    </View>
  );
}
