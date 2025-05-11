import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useExpenseStore } from '@/store/useExpenseStore';

export interface AddExpenseDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddExpenseDialog({ isOpen, setIsOpen }: AddExpenseDialogProps) {
  const { addExpense } = useExpenseStore();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
  });
  const [amountError, setAmountError] = useState('');

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'amount') setAmountError('');
  };

  const isFormValid =
    form.title.trim() !== '' &&
    form.amount.trim() !== '' &&
    form.category.trim() !== '';

  const handleAdd = async () => {
    if (!isFormValid) return;
    if (isNaN(Number(form.amount))) {
      setAmountError('Amount must be a valid number');
      return;
    }
    try {
      await addExpense({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString(),
      });
      Toast.show({ type: 'success', text1: 'Expense added' });
      setForm({ title: '', amount: '', category: '' });
      setIsOpen(false);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: "Could not add expense." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-screen max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <View className="space-y-4">
          <View>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Ex: Coffee"
              value={form.title}
              onChangeText={text => handleChange('title', text)}
            />
          </View>
          <View>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Ex: 500"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={text => handleChange('amount', text)}
            />
            {amountError ? (
              <Animated.Text
                entering={FadeInDown}
                exiting={FadeOut.duration(250)}
                className="text-destructive text-sm"
              >
                {amountError}
              </Animated.Text>
            ) : null}
          </View>
          <View>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Ex: Food"
              value={form.category}
              onChangeText={text => handleChange('category', text)}
            />
          </View>
        </View>

        <DialogFooter>
          <Button
            onPress={handleAdd}
            disabled={!isFormValid}
            className={`w-full ${!isFormValid ? 'opacity-50' : ''}`}
          >
            <View className="flex-row items-center gap-2">
              <FontAwesome name="plus" size={16} />
              <Text>Add</Text>
            </View>
          </Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
