import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { useColorScheme } from 'nativewind';

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
  const { items, fetchExpenses } = useExpenseStore();
  const [now] = useState(new Date());
  const { width: screenWidth } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Totals per category for year/month/day
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

  // Extract single top category and its share
  const extractTop = (catTotals: CategoryTotals) => {
    const entries = Object.entries(catTotals);
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    if (!entries.length || total === 0) return { label: '—', data: [0] };
    const [topCat, topVal] = entries.sort((a, b) => b[1] - a[1])[0];
    return { label: topCat, data: [topVal / total] };
  };

  const yearTop = extractTop(totals.year);
  const monthTop = extractTop(totals.month);
  const dayTop = extractTop(totals.day);

  // Monthly series for the LineChart
  const monthlySeries = useMemo(() => {
    const arr = Array(12).fill(0);
    items.forEach(({ amount, date }) => {
      const d = new Date(date);
      if (d.getFullYear() === now.getFullYear()) {
        arr[d.getMonth()] += amount;
      }
    });
    return arr;
  }, [items, now]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: isDark ? '#1F2937' : '#ffffff',
    backgroundGradientTo: isDark ? '#1F2937' : '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(${isDark ? '107,114,128' : '59,130,246'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '107,114,128' : '59,130,246'}, ${opacity})`,
  };

  // Top category blocks
  const topBlocks = [
    { label: 'This Year', ...yearTop },
    { label: 'This Month', ...monthTop },
    { label: 'Today', ...dayTop },
  ];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-300 dark:border-gray-600 p-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">📈 Analytics</Text>
      </View>
      <ScrollView className="gap-2">
        {/* Top Category Rings */}
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">🏆 Top Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {topBlocks.map(({ label, data }, idx) => {
            const percent = data[0] > 0 ? (data[0] * 100).toFixed(1) : '0';
            const cardWidth = screenWidth * 0.7;
            return (
              <View
                key={idx}
                className="mr-4 rounded-2xl p-4 shadow-md"
                style={{ width: cardWidth, backgroundColor: isDark ? '#1F2937' : '#ffffff' }}
              >
                <Text className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2" numberOfLines={1} ellipsizeMode="tail">
                  {label}
                </Text>
                <ProgressChart
                  data={{ data }}
                  width={cardWidth * 0.5}
                  height={120}
                  strokeWidth={12}
                  radius={40}
                  chartConfig={chartConfig}
                  hideLegend
                  style={{ backgroundColor: 'transparent' }}
                />
                <Text className="mt-2 text-center text-gray-800 dark:text-gray-200">
                  {percent}% of spend
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Monthly Trend LineChart */}
        <Text className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          📊 Monthly Trend ({format(now, 'yyyy')})
        </Text>
        <View className="rounded-2xl overflow-hidden shadow-md"
              style={{ backgroundColor: isDark ? '#1F2937' : '#ffffff' }}>
          <LineChart
            data={{
              labels: Array.from({ length: 12 }, (_, i) => format(new Date(now.getFullYear(), i, 1), 'MMM')),
              datasets: [{ data: monthlySeries }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="$ "
            chartConfig={chartConfig}
            bezier
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
