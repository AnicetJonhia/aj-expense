import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import { Combobox } from '@/components/ui/combobox';
import {Text} from "@/components/ui/text";

type ComboboxItem = {
  value: string;
  label: string;
};

export default function Dashboard() {
  const { items } = useExpenseStore();
  const [filter, setFilter] = useState<'day' | 'month' | 'year'>('day');
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [categoryExpenses, setCategoryExpenses] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  function filterExpenses(filter: 'day' | 'month' | 'year') {
    const now = new Date();
    let filtered = items;

    if (filter === 'day') {
      filtered = items.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'));
    } else if (filter === 'month') {
      filtered = items.filter(e => format(new Date(e.date), 'yyyy-MM') === format(now, 'yyyy-MM'));
    } else {
      filtered = items.filter(e => format(new Date(e.date), 'yyyy') === format(now, 'yyyy'));
    }

    let total = 0;
    const categories: { [key: string]: number } = {};

    filtered.forEach(expense => {
      const amount = Number(expense.amount);
      if (isFinite(amount) && (!selectedCategory || expense.category === selectedCategory)) {
        total += amount;
        categories[expense.category] = (categories[expense.category] || 0) + amount;
      }
    });

    setTotalExpense(isFinite(total) ? total : 0);
    setCategoryExpenses(categories);
  }

  useEffect(() => {
    filterExpenses(filter);
  }, [filter, items, selectedCategory]);

  const filters: ComboboxItem[] = [
    { value: 'day', label: 'Day' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];
  const categoriesList: ComboboxItem[] = Array.from(new Set(items.map(i => i.category)))
    .map(c => ({ value: c, label: c }));

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  // Préparation des données du chart, on exclut les valeurs non finies
  const entries = Object.entries(categoryExpenses).filter(([, v]) => isFinite(v));
  const chartLabels = entries.map(([cat]) => cat);
  const chartData = entries.map(([, v]) => v);

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <Text className="text-xl font-bold">Expense Dashboard</Text>

      <View className="mt-4">
        <Text>Filter by:</Text>
        <Combobox
          items={filters}
          selectedItem={filters.find(f => f.value === filter) || null}
          onSelectedItemChange={(val: ComboboxItem) => setFilter(val.value as any)}
          placeholder="Select Time Period"
        />
      </View>

      <View className="mt-6">
        <Text>Total Expenses: {formatNumber(totalExpense)} Ar</Text>
      </View>

      <View className="mt-6">
        <Text className="text-lg">Expenses by Category:</Text>
        <Combobox
          items={categoriesList}
          selectedItem={selectedCategory ? { value: selectedCategory, label: selectedCategory } : null}
          onSelectedItemChange={(val: ComboboxItem) => setSelectedCategory(val.value)}
          placeholder="Select Category"
        />
      </View>

      <View className="mt-6">
        {chartData.length > 1 ? (
          <LineChart
            data={{ labels: chartLabels, datasets: [{ data: chartData }] }}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
            }}
            bezier
          />
        ) : (
          <Text className="text-center text-gray-500 mt-4">
            Not enough data to display chart.
          </Text>
        )}
      </View>

      
    </ScrollView>
  );
}
