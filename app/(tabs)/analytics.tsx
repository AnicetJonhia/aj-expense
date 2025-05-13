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

type CategoryTotals = Record<string, number>;

export default function AnalyticsScreen() {
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
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
    if (!entries.length || total === 0) return { category: '—', data: [0] };
    const [topCat, topVal] = entries.sort((a, b) => b[1] - a[1])[0];
    return { category: topCat, data: [topVal / total] };
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
    backgroundGradientFrom: isDark ? '#27272A' : '#F4F4F5', // zinc-800 / zinc-100
    backgroundGradientTo: isDark ? '#27272A' : '#F4F4F5',
    decimalPlaces: 1,
    color: (opacity: number = 1) =>
      isDark
        ? `rgba(107,114,128,${opacity})` // zinc-500
        : `rgba(59,130,246,${opacity})`,  // blue-500
    labelColor: (opacity: number = 1) =>
      isDark
        ? `rgba(107,114,128,${opacity})`
        : `rgba(59,130,246,${opacity})`,
  };

  // Top category blocks
  const topBlocks = [
    { period: 'This Year', ...yearTop },
    { period: 'This Month', ...monthTop },
    { period: 'Today', ...dayTop },
  ];

  return (
     <View className="flex-1 p-4 gap-2 bg-white dark:bg-black">
      {/* Header */}
      <TabHeader title={"Analytics"} onAddPress={() => setIsAddOpen(true)} />
      <ScrollView showsVerticalScrollIndicator={false} className="gap-4">
        {/* Top Category Rings */}
        
        <Text className="text-2xl font-bold mt-4">🏆 Top Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          {topBlocks.map(({ period, category, data }, idx) => {
            const percent = data[0] > 0 ? (data[0] * 100).toFixed(1) : '0';
            const cardWidth = screenWidth * 0.52;
            return (
              <View
                key={idx}
                className="m-4 flex-1 rounded-2xl p-4 shadow-md"
                style={{ width: cardWidth, backgroundColor: isDark ? '#27272A' : '#F4F4F5' }}
              >
                <Text
                  className=" text-center  font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <FontAwesome name="calendar-check-o"/>  {period}
                </Text>
                <View className="items-center">
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
                </View>
                <Text className="mt-2 text-xl font-bold text-center text-zinc-800 dark:text-zinc-200">
                  {percent}% {category}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <Separator/>
        {/* Monthly Trend LineChart */}
        <View className='mt-4 gap-4 flex'>


          <Text className="text-2xl font-bold "> 📊 Monthly Trend ({format(now, 'yyyy')})</Text>
          <View
            className="rounded-2xl mb-4 pr-2 overflow-hidden shadow-md"
            style={{ backgroundColor: isDark ? '#27272A' : '#F4F4F5' }}
          >
            <LineChart
              data={{
                labels: Array.from({ length: 12 }, (_, i) =>
                  format(new Date(now.getFullYear(), i, 1), 'MMM'),
                ),
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
        </View>
      </ScrollView>

        <AddExpenseDialog isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </View>
  );
}
