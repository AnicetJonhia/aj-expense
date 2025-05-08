import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import { useEffect } from 'react';
import { FlatList, View } from 'react-native';

export default function ExpenseScreen() {
  const { items, fetchExpenses, deleteExpense , updateExpense} = useExpenseStore();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleUpdate = async () => {
    const first = items[0];
    if (first) {
      await updateExpense(first.id, {
        title: 'Café amélioré',
        amount: 500,
      });
    }
  };


  return (
    <View className="flex-1 p-4 bg-white dark:bg-black">
      <Text className="text-xl font-bold mb-4">Mes Dépenses</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text className="text-base">{item.title} - {item.amount} Ar</Text>
        )}
      />

      <Button onPress={() => deleteExpense(items[0]?.id)}>
        <Text>Supprimer la première dépense</Text>
      </Button>
      
      <Button className='mt-4' onPress={handleUpdate}>
        <Text>Mettre à jour la première</Text>
      </Button>
    </View>
  );
}
