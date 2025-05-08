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
    date: expense.date,
  });

  const handleChange = (key: string, value: string) => {
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
            <Input
              id="date"
              value={form.date}
              onChangeText={(text) => handleChange('date', text)}
              placeholder="YYYY-MM-DD"
            />
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
