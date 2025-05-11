import React, { useState, useMemo } from 'react';
import { View } from 'react-native';
import { Combobox } from '@/components/ui/combobox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import { FontAwesome } from '@expo/vector-icons';

type ComboboxItem = { label: string; value: string };

interface DashboardCategoryFilterProps {
  /** dateString au format "" | "YYYY" | "YYYY-MM" | "YYYY-MM-DD" */
  dateString: string;
}

export default function DashboardCategoryFilter({ dateString }: DashboardCategoryFilterProps) {
  const { items } = useExpenseStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Parse year, month, day depuis dateString
  const [year, month, day] = useMemo(() => {
    if (!dateString) return [null, null, null];
    const parts = dateString.split('-');
    return [
      parts[0] || null,
      parts[1] || null,
      parts[2] || null,
    ];
  }, [dateString]);

  // 1️⃣ Filtrer les dépenses selon dateString
  const itemsByDate = useMemo(() => {
    if (!year) return items;
    return items.filter(exp => {
      const d = new Date(exp.date);
      if (String(d.getFullYear()) !== year) return false;
      if (month && String(d.getMonth() + 1).padStart(2, '0') !== month) return false;
      if (day && String(d.getDate()).padStart(2, '0') !== day) return false;
      return true;
    });
  }, [items, year, month, day]);

  // 2️⃣ Extraire les catégories uniques pour le Combobox
  const categories = useMemo<ComboboxItem[]>(() => {
    const setC = new Set(itemsByDate.map(exp => exp.category));
    return [...setC]
      .sort()
      .map(cat => ({ label: cat, value: cat }));
  }, [itemsByDate]);

  // 3️⃣ Totaux par niveau de granularité
  const totalByYear = useMemo(() => {
    if (!year || !selectedCategory) return 0;
    return itemsByDate
      .filter(exp => exp.category === selectedCategory)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [itemsByDate, year, selectedCategory]);

  const totalByMonth = useMemo(() => {
    if (!year || !month || !selectedCategory) return 0;
    return itemsByDate
      .filter(exp => exp.category === selectedCategory)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [itemsByDate, month, selectedCategory]);

  const totalByDay = useMemo(() => {
    if (!year || !month || !day || !selectedCategory) return 0;
    return itemsByDate
      .filter(exp => exp.category === selectedCategory)
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [itemsByDate, day, selectedCategory]);

  return (
    <View className="gap-2 mt-6 mb-2">
      {/* Choix de la catégorie */}
      <Text className='text-2xl font-bold '>Filter by category</Text>
      <Combobox
        items={[
            { label: "All Categories", value: "" },
            ...categories
          ]}
          selectedItem={
            selectedCategory
              ? { label: selectedCategory, value: selectedCategory }
              : { label: "All Categories", value: "" }
          }
          onSelectedItemChange={opt => setSelectedCategory(opt.value || null)}
        placeholder="Select category"
      />

      {/* Card 1 : total annuel */}
      {year && selectedCategory && (
        <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
            <CardContent className="p-4 flex-row justify-between items-center">
            <View>
            <View className="flex-row gap-2 items-center">
            <Text> <FontAwesome name="calendar" size={20} /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {year} 
              </Text>
              </View>
              <Text className="text-xl font-bold text-primary">
                {totalByYear} Ar
              </Text>
            </View>
           <Text> {selectedCategory}</Text>
          </CardContent>
        </Card>
      )}

      {/* Card 2 : total mensuel */}
      {year && month && selectedCategory && (
        <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
            <CardContent className="p-4 flex-row justify-between items-center">
            <View>
                  <View className="flex-row gap-2 items-center">
                  <Text><FontAwesome name="calendar-o" size={20} /></Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(Number(year), Number(month) - 1, 1), 'MMMM yyyy')} 
                    </Text>
                </View>
              <Text className="text-xl font-bold text-primary">
                {totalByMonth} Ar
              </Text>
            </View>
            <Text >{selectedCategory}</Text>
          </CardContent>
        </Card>
      )}

      {/* Card 3 : total journalier */}
      {year && month && day && selectedCategory && (
        <Card className="mt-2 bg-gray-100 dark:bg-gray-900">
            <CardContent className="p-4 flex-row justify-between items-center">
            <View>
            <View className="flex-row gap-2 items-center">
            <Text><FontAwesome name="calendar-check-o" size={20} /></Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {format(
                  new Date(Number(year), Number(month) - 1, Number(day)),
                  'MMMM do, yyyy'
                )}{' '}
                
              </Text>
              </View>
              <Text className="text-xl font-bold text-primary">
                {totalByDay} Ar
              </Text>
            </View>
            <Text>{selectedCategory}</Text>
          </CardContent>
        </Card>
      )}
    </View>
  );
}
