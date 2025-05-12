import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { format } from 'date-fns';

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
  const { items, fetchExpenses } = useExpenseStore();
  const [now] = useState(new Date());
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 1️⃣ Compute totals by category for year/month/day
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

  // 2️⃣ Build pie-chart data for current year
  const pieData = useMemo(() => {
    const entries = Object.entries(totals.year);
    const colors = ['#4F46E5','#10B981','#EF4444','#F59E0B','#3B82F6','#8B5CF6'];
    return entries.map(([cat, sum], i) => ({
      name: cat,
      population: sum,
      color: colors[i % colors.length],
      legendFontColor: '#4B5563',
      legendFontSize: 12,
    }));
  }, [totals.year]);

  // 3️⃣ Build monthly series for line chart
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
     <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-300 dark:border-gray-600 pb-2 ">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          📈 Analytics
        </Text>
      </View>
      <ScrollView className="flex-1 px-4 py-6">
      {/* PieChart for top categories of the year */}
      <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        🥧 Top categories this year
      </Text>
      <View className="rounded-2xl overflow-hidden bg-white dark:bg-[#1F2937] shadow-md mb-6">
        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: (_opacity = 1) => `rgba(255, 255, 255, ${_opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* LineChart for monthly evolution */}
      <Text className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
        📊 Monthly trend ({format(now, 'yyyy')})
      </Text>
      <View className="rounded-2xl overflow-hidden bg-white dark:bg-[#1F2937] shadow-md mb-6">
        <LineChart
          data={{
            labels: Array.from({ length: 12 }, (_, i) =>
              format(new Date(now.getFullYear(), i, 1), 'MMM')
            ),
            datasets: [{ data: monthlySeries }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="$ "
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // blue-500
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`, // gray-500
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#3B82F6',
            },
          }}
          bezier
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </View>

    </ScrollView>
    </View>
  );
}
