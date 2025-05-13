import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { useColorScheme } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { Separator } from '@/components/ui/separator';
import TabHeader from '@/components/TabHeader';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const { items, fetchExpenses } = useExpenseStore();
  const [now] = useState(() => new Date());
  const { width: screenWidth } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // --- fetch on mount ---
  useEffect(() => {
    fetchExpenses();
  }, []);

  // --- dynamic list of years from your data ---
  const years = useMemo<ComboboxOption[]>(() => {
    const setY = new Set(items.map(i => new Date(i.date).getFullYear()));
    return [...setY]
      .sort((a, b) => b - a)
      .map(y => ({ label: String(y), value: String(y) }));
  }, [items]);

  // --- which year is selected (defaults to current) ---
  const [selectedYear, setSelectedYear] = useState<string>(String(now.getFullYear()));

  // --- per-category totals for top-category rings (always based on current date) ---
  const totals = useMemo(() => {
    const catYear: CategoryTotals = {};
    const catMonth: CategoryTotals = {};
    const catDay: CategoryTotals = {};
    items.forEach(({ amount, category, date }) => {
      const d = new Date(date);
      if (d.getFullYear() === now.getFullYear()) {
        catYear[category] = (catYear[category] || 0) + amount;
        if (d.getMonth() === now.getMonth()) {
          catMonth[category] = (catMonth[category] || 0) + amount;
          if (d.getDate() === now.getDate()) {
            catDay[category] = (catDay[category] || 0) + amount;
          }
        }
      }
    });
    return { year: catYear, month: catMonth, day: catDay };
  }, [items, now]);

  const extractTop = (catTotals: CategoryTotals) => {
    const entries = Object.entries(catTotals);
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    if (!entries.length || total === 0) return { category: '—', data: [0] };
    const [topCat, topVal] = entries.sort((a, b) => b[1] - a[1])[0];
    return { category: topCat, data: [topVal / total] };
  };

  const yearTop  = extractTop(totals.year);
  const monthTop = extractTop(totals.month);
  const dayTop   = extractTop(totals.day);

  // --- monthly series FOR the selectedYear combobox ---
  const monthlySeries = useMemo(() => {
    const yearNum = Number(selectedYear);
    const arr = Array(12).fill(0);
    items.forEach(({ amount, date }) => {
      const d = new Date(date);
      if (d.getFullYear() === yearNum) {
        arr[d.getMonth()] += amount;
      }
    });
    return arr;
  }, [items, selectedYear]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: isDark ? '#27272A' : '#F4F4F5', // zinc‐800 / zinc‐100
    backgroundGradientTo:   isDark ? '#27272A' : '#F4F4F5',
    decimalPlaces: 1,
    color:       (op = 1) => isDark ? `rgba(107,114,128,${op})` : `rgba(59,130,246,${op})`,
    labelColor:  (op = 1) => isDark ? `rgba(107,114,128,${op})` : `rgba(59,130,246,${op})`,
  };

  const topBlocks = [
    { period: 'This Year',  ...yearTop  },
    { period: 'This Month', ...monthTop },
    { period: 'Today',      ...dayTop   },
  ];

  return (
    <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
      <TabHeader title="Analytics" onAddPress={() => setIsAddOpen(true)} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top-Categories */}
        <Text className="text-2xl font-bold mt-4 text-gray-800 dark:text-white">🏆 Top Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topBlocks.map(({ period, category, data }, idx) => {
            const pct = (data[0] * 100).toFixed(1);
            const cardW = screenWidth * 0.6;
            return (
              <View
                key={idx}
                className="m-2 p-4 rounded-2xl p-4 shadow-md"
                style={{ width: cardW, backgroundColor: isDark ? '#27272A' : '#F4F4F5' }}
              >
                <Text className="text-center font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  <FontAwesome name="calendar-check-o" size={16} /> {period}
                </Text>
                <View className="items-center">
                  <ProgressChart
                    data={{ data }}
                    width={cardW * 0.5}
                    height={120}
                    strokeWidth={12}
                    radius={40}
                    chartConfig={chartConfig}
                    hideLegend
                    style={{ backgroundColor: 'transparent' }}
                  />
                </View>
                <Text className="mt-2 text-center font-bold text-gray-800 dark:text-gray-200">
                  {pct}% of spend in {category}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <Separator />

        {/* Monthly Trend + Year selector */}
        <Text className="text-2xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
          📊 Monthly Trend
        </Text>
        <View className="mb-4 flex-row items-center gap-2">
        <Text className=" text-gray-600 dark:text-gray-400">
            Year : 
          </Text>
          <View className="flex-1">
            <Combobox
            items={years}
            selectedItem={years.find(y => y.value === selectedYear) || null}
            onSelectedItemChange={opt => setSelectedYear(opt.value)}
            placeholder="Select Year"
          /></View>
          
        </View>
        <View
          className="rounded-2xl overflow-hidden shadow-md mb-8"
          style={{ backgroundColor: isDark ? '#27272A' : '#F4F4F5' }}
        >
          <LineChart
            data={{
              labels: Array.from({ length: 12 }, (_, i) => format(new Date(Number(selectedYear), i, 1), 'MMM')),
              datasets: [{ data: monthlySeries }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="Ar "
            chartConfig={chartConfig}
            bezier
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      </ScrollView>

      <AddExpenseDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </View>
  );
}
