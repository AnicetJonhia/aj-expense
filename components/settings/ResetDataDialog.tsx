import { Button } from "@/components/ui/button";
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import ExpenseDeleteDialog from '../expenses/ExpenseDeleteDialog';

export interface ResetDataDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

}

export default function ResetDataDialog({
  isOpen,
  setIsOpen,

}: ResetDataDialogProps) {
  const { items, fetchExpenses,deleteFilteredExpenses } = useExpenseStore();

  useEffect(() => {
      fetchExpenses();
    }, []);

  // derive unique years from items
  const years = useMemo(() => {
    const setY = new Set(items.map(i => new Date(i.date).getFullYear()));
    return [{ label: 'All Years', value: 'all' }].concat(
      [...setY]
        .sort((a, b) => b - a)
        .map(y => ({ label: String(y), value: String(y) }))
    );
  }, [items]);

  const [selectedYear, setSelectedYear] = useState<string | number>('all');
  const [selectedMonth, setSelectedMonth] = useState<string | number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  // months depend on year
  const months = useMemo(() => {
    if (selectedYear === 'all') return [];
    const setM = new Set(
      items
        .filter(i => new Date(i.date).getFullYear() === Number(selectedYear))
        .map(i => new Date(i.date).getMonth())
    );
    return [...setM]
      .sort((a, b) => a - b)
      .map(m => ({ label: format(new Date(Number(selectedYear), m, 1), 'MMMM'), value: String(m) }));
  }, [items, selectedYear]);

  // days depend on year and month
  const days = useMemo(() => {
    if (selectedYear === 'all' || selectedMonth == null) return [];
    const setD = new Set(
      items
        .filter(i => {
          const d = new Date(i.date);
          return (
            d.getFullYear() === Number(selectedYear) && d.getMonth() === Number(selectedMonth)
          );
        })
        .map(i => new Date(i.date).getDate())
    );
    return [...setD]
      .sort((a, b) => a - b)
      .map(dy => ({ label: String(dy), value: String(dy) }));
  }, [items, selectedYear, selectedMonth]);

  function handleDelete() {
    const yearParam = selectedYear === 'all' ? undefined : Number(selectedYear);
    const monthParam =
      selectedMonth == null ? undefined : Number(selectedMonth);
    const dayParam = selectedDay == null ? undefined : Number(selectedDay);

    deleteFilteredExpenses(yearParam, monthParam, dayParam);
  }

  
  return (<>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        
        <DialogHeader><DialogTitle>Reset Expenses Data</DialogTitle></DialogHeader>
        {/* Filters Section */}
        <View className="space-y-4 mt-2">
          <Text className="text-sm font-medium">Filter by Date:</Text>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Combobox
                items={years}
                selectedItem={years.find(y => y.value === selectedYear) || null}
                onSelectedItemChange={opt => {
                  setSelectedYear(opt.value);
                  setSelectedMonth(null);
                  setSelectedDay(null);
                }}
                placeholder="Year"
              />
            </View>
            <View className="flex-1">
              <Combobox
                items={months}
                selectedItem={months.find(m => m.value === selectedMonth) || null}
                onSelectedItemChange={opt => {
                  setSelectedMonth(opt.value);
                  setSelectedDay(null);
                }}
                placeholder="Month"
                disabled={selectedYear === 'all'}
              />
            </View>
            <View className="flex-1">
              <Combobox
                items={days}
                selectedItem={days.find(d => d.value === selectedDay) || null}
                onSelectedItemChange={opt => setSelectedDay(opt.value)}
                placeholder="Day"
                disabled={!selectedMonth}
              />
            </View>
          </View>
        </View>

        <DialogFooter>
         
            
            <Button variant="destructive"  onPress={()=>{
                setIsOpen(false);
                setIsDeleteOpen(true);
            }}>
              <Text>Delete</Text>
            </Button>
       
        </DialogFooter>
      </DialogContent>
    </Dialog>


    <ExpenseDeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        itemTitle="Reset Expenses"
        onConfirm={async () => {
          await handleDelete()
         
          Toast.show({
            type: 'success',
            text1: 'Data Reset',
            text2: 'Your expenses were successfully removed.',
          });
        }}
      />
    </>
  );
}
