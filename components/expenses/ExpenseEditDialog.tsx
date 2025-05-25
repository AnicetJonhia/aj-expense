import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Combobox } from '@/components/ui/combobox';
import { useEffect , useState,useMemo} from 'react';

type ComboboxItem = {
  value: string;
  label: string;
};

type ExpenseEditDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  expense: {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
  };
};

export default function ExpenseEditDialog({
  isOpen,
  setIsOpen,
  expense,
}: ExpenseEditDialogProps) {
  const { updateExpense } = useExpenseStore();


  const parsedDate = useMemo(() => new Date(expense.date), [expense.date]);


  const [form, setForm] = useState({
    title: expense.title,
    amount: String(expense.amount),
    category: expense.category,
    date: parsedDate,
  });

  


  const years: ComboboxItem[] = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: `${year}`, label: `${year}` };
  });

  const months: ComboboxItem[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ].map((m, i) => ({
    value: `${i + 1}`.padStart(2, '0'),
    label: m,
  }));

  const [selectedYear, setSelectedYear] = useState<ComboboxItem | undefined>(
    years.find((item) => item.value === `${parsedDate.getFullYear()}`)
  );
  const [selectedMonth, setSelectedMonth] = useState<ComboboxItem | undefined>(
    months.find((item) => item.value === `${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}`)
  );
  const [selectedDay, setSelectedDay] = useState<ComboboxItem | undefined>(
    undefined
  );

  const days: ComboboxItem[] = useMemo(() => {
    if (!selectedYear?.value || !selectedMonth?.value) return [];
    const daysInMonth = new Date(
      Number(selectedYear.value),
      Number(selectedMonth.value),
      0
    ).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = `${i + 1}`.padStart(2, '0');
      return { value: day, label: day };
    });
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const currentDay = `${parsedDate.getDate()}`.padStart(2, '0');
    setSelectedDay(days.find((d) => d.value === currentDay));
  }, [days, parsedDate]);

  useEffect(() => {
    if (selectedYear?.value && selectedMonth?.value && selectedDay?.value) {
      const updatedDate = new Date(
        Number(selectedYear.value),
        Number(selectedMonth.value) - 1,
        Number(selectedDay.value)
      );
      setForm((prev) => ({ ...prev, date: updatedDate }));
    }
  }, [selectedYear, selectedMonth, selectedDay]);


  const handleChange = (key: string, value: string | Date) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    if (!form.title || !form.amount || !form.category || !form.date) return;

    if (isNaN(Number(form.amount))) {
      Toast.show({
        type: 'error',
        text1: 'Invalid amount',
        text2: 'Amount must be a number.',
      });
      return;
    }

    await updateExpense(expense.id, {
      ...form,
      amount: Number(form.amount),
      date: form.date.toISOString(),
    });

    Toast.show({
      type: 'success',
      text1: 'Expense updated',
    });

    setIsOpen(false); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>

        <View className="space-y-3 ">
          <View>
            <Label htmlFor="title">Title:</Label>
            <Input
              id="title"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
          </View>

          <View>
            <Label htmlFor="amount">Amount(Ar):</Label>
            <Input
              id="amount"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={(text) => handleChange('amount', text)}
            />
          </View>

          <View>
            <Label htmlFor="category">Category:</Label>
            <Input
              id="category"
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
            />
          </View>

          <View>
            <Label htmlFor="date">Date:</Label>
            <View className="flex-row gap-2 mt-1">
            <View className="flex-1 ">
            <Combobox
                  items={years}
                  selectedItem={selectedYear}
                  onSelectedItemChange={(val) => setSelectedYear(val)}
                  placeholder="Year"
                />
              </View>

              <View className="flex-1">
                <Combobox
                  items={months}
                  selectedItem={selectedMonth}
                  onSelectedItemChange={(val) => {
                    setSelectedMonth(val);
                   
                  }}
                  placeholder="Month"
                />
              </View>

              <View className="flex-1">
                <Combobox
                  items={days}
                  selectedItem={selectedDay}
                  onSelectedItemChange={(val) => {
                    setSelectedDay(val);
                  }}
                  placeholder="Day"
                />
              </View>
            </View>

            
          </View>
        </View>

        <DialogFooter>
          <Button onPress={handleUpdate}>
            <Text>Save</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
