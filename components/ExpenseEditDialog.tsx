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
import { DatePicker } from './ui/DatePicker';

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

  const [form, setForm] = React.useState({
    title: expense.title,
    amount: String(expense.amount),
    category: expense.category,
    date: expense.date ? new Date(expense.date) : new Date(),

  });

  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);


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

    setIsOpen(false); // fermer le dialog
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogDescription>
            Modify the fields and click Save to update.
          </DialogDescription>
        </DialogHeader>

        <View className="space-y-3 py-4">
          <View>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
          </View>

          <View>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={(text) => handleChange('amount', text)}
            />
          </View>

          <View>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
            />
          </View>

          <View>
            <Label htmlFor="date">Date</Label>
            <Button variant="outline" onPress={() => setShowDatePicker(true)}>
                <Text>{form.date.toDateString()}</Text>
            </Button>

            {showDatePicker && (
                <DatePicker
                value={form.date}
                mode="date"
                onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const updatedDate = new Date(form.date);
                      updatedDate.setFullYear(selectedDate.getFullYear());
                      updatedDate.setMonth(selectedDate.getMonth());
                      updatedDate.setDate(selectedDate.getDate());
                      handleChange('date', updatedDate);
                    }
                  }}
                  locale="en"
                display="default"
                />
            )}
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
