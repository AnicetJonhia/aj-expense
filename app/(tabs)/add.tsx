import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';

export default function AddScreen() {
  const { addExpense } = useExpenseStore();

  const handleAdd = async () => {
    await addExpense({
      title: 'Café',
      amount: 300,
      category: 'Boisson',
      date: new Date().toISOString(),
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-primary">Ajouter une dépense</Text>
      <Button onPress={handleAdd}>
        <Text>Ajouter</Text>
      </Button>
    </View>
  );
}
