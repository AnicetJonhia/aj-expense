import * as React from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { useEffect , useState} from 'react';
import { FlatList, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Pressable} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ExpenseScreen() {
  const { items, fetchExpenses, deleteExpense, updateExpense } = useExpenseStore();




  


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
      <Text className="text-xl font-bold mb-4">My Expenses</Text>

      {items.length === 0 ? (
        <View
          className="flex-1 justify-center items-center border border-dashed border-gray-400 rounded-md p-4 my-4"
        >
          <Text className="text-center text-gray-500 dark:text-gray-400">
          No expenses for now.
          
          </Text>
          <Link href="/add" className="text-blue-500">
          Add Expense <FontAwesome name="clipboard" size={16} className="ml-2" /> 

          </Link>
        </View>
      ) : (
        <>
          <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Card className="mb-4">
                  <CardContent className="py-3 px-4">
                    <View className="flex-row justify-between items-center">
                  
                      <View className="flex-1 justify-center">
                       
                        <View className="flex-row justify-between  items-center">
                          <Text className="font-medium">
                            {item.title}{' '}
                            <Text className="text-gray-500">({item.category})</Text>
                          </Text>
                          <Text className="text-sm text-gray-400 ml-auto justify-center items-center">
                            {format(new Date(item.date), 'PPP')}
                          </Text>
                        </View>
              
                        <Text className="text-lg font-bold text-primary mt-1">
                          {item.amount} Ar
                        </Text>
                      </View>

             
                      <View className="ml-4 justify-center items-center">
                      
                      <DropdownMenu>
                            <DropdownMenuTrigger  asChild>
                              <TouchableOpacity >
                                <Text ><FontAwesome name="ellipsis-h" size={16} className="mr-2 " /></Text>
                              </TouchableOpacity>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-40">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuGroup>
                                <DropdownMenuItem onPress={handleUpdate}>
                                  
                                  <Text><FontAwesome name="edit" size={16} className="mr-2 " /></Text>
                                  <Text>Edit</Text>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onPress={() => deleteExpense(item?.id)}>
                                  <Text><FontAwesome name="trash" size={16} className="mr-2" /></Text>
                                  <Text className="text-red-700">Delete</Text>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}
            />

         
         
        </>
      )}
    </View>
  );
}
