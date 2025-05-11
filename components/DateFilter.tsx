import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
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

  // ---------------------------------------------------
  // états locaux
  // ---------------------------------------------------
  const [checked, setChecked] = useState(true); // “All” mode
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [year, setYear] = useState<string>('all');
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);

  // ---------------------------------------------------
  // on récupère d’abord la liste des dépenses
  // ---------------------------------------------------
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ---------------------------------------------------
  // calcul dynamique des listes
  // ---------------------------------------------------
  const years = useMemo(() => {
    const setY = new Set(items.map(i => new Date(i.date).getFullYear()));
    return [
      { label: 'All Years', value: 'all' },
      ...[...setY]
        .sort((a, b) => b - a)
        .map(y => ({ label: String(y), value: String(y) }))
    ];
  }, [items]);

  const months = useMemo(() => {
    if (year === 'all') return [];
    const setM = new Set(
      items
        .filter(i => new Date(i.date).getFullYear() === Number(year))
        .map(i => new Date(i.date).getMonth() +1 )
    );
    return [...setM]
      .sort((a, b) => a - b)
      .map(m => ({
        label: format(new Date(Number(year),m - 1, 1), 'MMMM'),
        value: String(m),
      }));
  }, [items, year]);

  const days = useMemo(() => {
    if (year === 'all' || month == null) return [];
    const m0 = Number(month) - 1; // 0-based
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
      .map(dy => ({ value: String(dy).padStart(2, '0'), label: String(dy) }));
  }, [items, year, month]);
  

  // ---------------------------------------------------
  // résultat date “YYYY[-MM[-DD]]”
  // ---------------------------------------------------
  const dateString = useMemo(() => {
    if (year === 'all') return '';
    if (!month) return year;
    if (!day) return `${year}-${month.padStart(2, '0')}`;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, [year, month, day]);

  // ---------------------------------------------------
  // callback vers le parent
  // ---------------------------------------------------
  useEffect(() => {
    if (checked) {
      // mode “All”
      onDateChange({ date: '', category: '' });
    } else {
      onDateChange({
        date: dateString,
        category: selectedCategory || '',
      });
    }
  }, [checked, dateString, selectedCategory, onDateChange]);

  // ---------------------------------------------------
  // rendu
  // ---------------------------------------------------
  return (
    <View className="space-y-4">
      {/* switch “All” */}
      <View className="flex-row items-center gap-2">
        <Switch checked={checked} onCheckedChange={setChecked} nativeID="all" />
        <Label nativeID="all" onPress={() => setChecked(prev => !prev)}>
          All
        </Label>
      </View>

      {/* catégorie */}
      <Label>Filter by category:</Label>
      <Combobox
        items={Array.from(new Set(items.map(i => i.category))).map(cat => ({
          label: cat,
          value: cat,
        }))}
        selectedItem={
          selectedCategory
            ? { label: selectedCategory, value: selectedCategory }
            : null
        }
        onSelectedItemChange={opt => {
          setSelectedCategory(opt.value);
          setChecked(false);
        }}
        placeholder="Select category"
      />

      {/* date */}
      <Label>Filter by date:</Label>
      <View className="flex-row gap-2">
        {/* année */}
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

        {/* mois */}
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

        {/* jour */}
        {month != null && (
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
    </View>
  );
}
