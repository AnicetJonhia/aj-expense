import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
  const { items, fetchExpenses } = useExpenseStore();
  const [now] = useState(new Date());
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    fetchExpenses();
  }, []);

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

  const topCategory = (catTotals: CategoryTotals) =>
    Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

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

  return (
    <ScrollView className="flex-1 bg-white dark:bg-[rgba(22,26,35,1)] px-4 py-6">
      <Text className="text-2xl font-bold text-primary dark:text-white mb-6">
        📈 Statistiques
      </Text>

      {/* Bloc Top Catégories */}
      <View className="mb-6 space-y-1">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white">
          🏆 Catégories dominantes
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          • Cette année : <Text className="font-medium">{topCategory(totals.year)}</Text>
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          • Ce mois : <Text className="font-medium">{topCategory(totals.month)}</Text>
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          • Aujourd’hui : <Text className="font-medium">{topCategory(totals.day)}</Text>
        </Text>
      </View>

      {/* LineChart */}
      <Text className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        📊 Évolution mensuelle ({format(now, 'yyyy')})
      </Text>

      <View className="rounded-2xl overflow-hidden bg-white dark:bg-[#1C2226] shadow-md">
        <LineChart
          data={{
            labels: Array.from({ length: 12 }, (_, i) =>
              format(new Date(now.getFullYear(), i, 1), 'MMM')
            ),
            datasets: [{ data: monthlySeries }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="Ar "
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(20, 153, 17, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#149911',
            },
          }}
          bezier
        />
      </View>
    </ScrollView>
  );
}
