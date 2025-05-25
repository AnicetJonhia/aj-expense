import * as React from "react";


import { Text } from '@/components/ui/text';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {  View } from 'react-native';

interface MissingExpenseProps {
  onAddPress: () => void;
}

export default function MissingExpense ({ onAddPress }: MissingExpenseProps){
    return(
        <View
          className="flex-1 justify-center items-center border border-dashed border-gray-400 rounded-md p-4 my-4"
        >
          <Text className="text-center text-gray-500 dark:text-gray-400">
          No expenses for now.
          
          </Text>
          <Text onPress={onAddPress} className="text-blue-500">
          Add Expense <FontAwesome name="clipboard" size={16} className="ml-2" /> 

          </Text>
        </View>
    )
}