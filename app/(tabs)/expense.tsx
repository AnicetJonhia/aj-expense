import * as React from "react";

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useExpenseStore } from '@/store/useExpenseStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { format } from 'date-fns';

import { useEffect , useState} from 'react';
import { FlatList, View ,TouchableOpacity } from 'react-native';

import ExpenseListHeader from "@/components/ExpenseListHeader";
import ExpenseDeleteDialog from "@/components/ExpenseDeleteDialog";
import Toast from 'react-native-toast-message';
import ExpenseEditDialog from "@/components/ExpenseEditDialog";
import MissingExpense from "@/components/MissingExpense";
import {Input} from "@/components/ui/input"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Expense = {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
};

export default function ExpenseScreen() {
  const { items, fetchExpenses, deleteExpense } = useExpenseStore();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{ id: number; title: string } | null>(null);
  const [selectedExpenseForEdit, setSelectedExpenseForEdit] = useState<Expense | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);





  


  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  

  return (
    <View className="flex-1 p-4 gap-4 bg-white dark:bg-black">
      
      <ExpenseListHeader/>
      <View >
           
            <View className="relative w-full">
            <Input
              id="filter"
              placeholder="Search..."
              className="pr-10" 
              value={searchText}
              onChangeText={setSearchText}
            />
            <View className="absolute right-3 top-1/2 -translate-y-1/2">
              <Text>
                    <FontAwesome name="search-minus" size={24} />
                  </Text>
            </View>
          </View>
          </View>

      {filteredItems.length === 0 ? (
        <MissingExpense />
      ) : (
        <>
          <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (

                <>
                <Card className="mb-2">
                  <CardContent className="py-3 px-4">
                    <View className="flex-row justify-between items-center">
                  
                      <View className="flex-1 justify-center">
                       
                        <View className="flex-row justify-between  items-center">
                          <View className="flex-col items-start">
                              <Text className="font-medium">
                                {item.title}
                                
                              </Text>
                              <Text className="text-lg font-bold text-primary ">
                                {item.amount} Ar
                              </Text>
                          </View>
                          <View className="flex-col items-end">
                              <Text className="text-gray-500">{item.category}</Text>
                              <Text className="text-sm text-gray-400  justify-center items-center">
                                  {(() => {
                                    const parsedDate = new Date(item.date);
                                    return !isNaN(parsedDate.getTime()) ? format(parsedDate, 'PPP') : 'Invalid date';
                                  })()}
                                </Text>

                          </View>

                         
                        </View>


                      
                       
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
                                <DropdownMenuItem onPress={() => {
                                    setSelectedExpenseForEdit(item);
                                    setIsEditOpen(true);
                                  }}>

                                  
                                  <Text><FontAwesome name="edit" size={16} className="mr-2 " /></Text>
                                  <Text>Edit</Text>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onPress={() => setSelectedItem({ id: item.id, title: item.title })}>
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

                {selectedItem && (
                  <ExpenseDeleteDialog
                    isOpen={!!selectedItem}
                    setIsOpen={(open) => !open && setSelectedItem(null)}
                    onConfirm={async () => {
                      if (selectedItem) {
                        await deleteExpense(selectedItem.id);
                        setSelectedItem(null);
                        Toast.show({
                          type: 'success',
                          text1: 'Expense deleted',
                          text2: 'Your expense was successfully removed.',
                        });
                      }
                    }}
                    itemTitle={selectedItem?.title || ''}
                  />
                )}

                {selectedExpenseForEdit && (
                  <ExpenseEditDialog
                    isOpen={isEditOpen}
                    setIsOpen={(open) => {
                      if (!open) {
                        setIsEditOpen(false);
                        setSelectedExpenseForEdit(null);
                      }
                    }}
                    expense={selectedExpenseForEdit}
                  />
                )}


                



                </>
              )}
            />

         
        
        </>
      )}
    </View>
  );
}
