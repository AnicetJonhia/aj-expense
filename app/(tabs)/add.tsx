import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useExpenseStore } from '@/store/useExpenseStore';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/Colors';

export default function AddScreen() {
  const { addExpense } = useExpenseStore();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
  });
  const [amountError, setAmountError] = useState('');
  const { colorScheme } = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'dark'].tint;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'amount') setAmountError(''); // reset error on typing
  };

  const isFormValid =
  form.title.trim() !== '' &&
  form.amount.trim() !== '' &&
  form.category.trim() !== '';


  const handleAdd = async () => {
    if (!form.title || !form.amount || !form.category) return;

    if (isNaN(Number(form.amount))) {
      setAmountError("The amount must be a valid number");
      return;
    }

    await addExpense({
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      date: new Date().toISOString(),
    });


    try {
      await addExpense({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString(),
      });
    
      setForm({ title: '', amount: '', category: '' });
    
      Toast.show({
        type: 'success',
        text1: 'Expense added',
        text2: 'Your expense was successfully recorded.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while adding the expense.',
      });
    }
    

    
    setAmountError('');
  };

  return (
    <View className="flex-1 px-4 py-6 justify-center">
      <Card>
        <CardHeader className="items-center">
          <CardTitle>
            <Text className="text-xl font-bold text-primary">Add Expense</Text>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <View>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Ex: Café"
              value={form.title}
              onChangeText={(text) => handleChange('title', text)}
            />
          </View>

          <View>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Ex: 500"
              keyboardType="numeric"
              value={form.amount}
              onChangeText={(text) => handleChange('amount', text)}
              aria-invalid={!!amountError}
              aria-errormessage="inputError"
            />
            {amountError ? (
              <Animated.Text
                entering={FadeInDown}
                exiting={FadeOut.duration(275)}
                className="text-destructive text-sm px-1 py-1.5"
                aria-invalid="true"
                id="inputError"
              >
                {amountError}
              </Animated.Text>
            ) : null}
          </View>

          <View>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Ex: Boisson"
              value={form.category}
              onChangeText={(text) => handleChange('category', text)}
            />
          </View>
        </CardContent>

        <CardFooter >
          <Button onPress={handleAdd} disabled={!isFormValid} className={`w-full justify-center items-center  ${!isFormValid ? 'opacity-70' : ''}`}>
            
          <View className="flex flex-row items-center gap-2">
            <Text><FontAwesome name="plus" size={16} /></Text>
            <Text>Add</Text>
          </View>
          </Button>
        </CardFooter>
      </Card>
      
    </View>
  );
}
