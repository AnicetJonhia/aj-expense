import React, { useState } from 'react';
import {
  View,
  Pressable,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Check } from "@/lib/icons/Check"; // Assure-toi d'avoir installé cette lib ou adapte

interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  items: ComboboxOption[];
  placeholder?: string;
  selectedItem: ComboboxOption | null;
  onSelectedItemChange: (item: ComboboxOption) => void;
}

export function Combobox({
  items,
  placeholder,
  selectedItem,
  onSelectedItemChange,
}: ComboboxProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="w-full">
      <Pressable
        className={cn(
            'border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] flex-row justify-between items-center'
        )}
        onPress={() => setVisible(true)}
        >
        <Text className="text-base text-gray-700 dark:text-white">
          {selectedItem?.label || placeholder || 'Select...'}
        </Text>
        {selectedItem?.label && <Check />}
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center px-4">
          <View className="w-full max-w-md max-h-[80%] rounded-xl bg-white dark:bg-[#1E1E1E] p-4 space-y-3">
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#999"
              className="px-4 py-2 border border-gray-300 rounded-md text-black dark:text-white dark:bg-[#2a2a2a]"
              value={search}
              onChangeText={setSearch}
            />
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.value}
              style={{ maxHeight: 300 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedItem?.value === item.value;
                return (
                  <Pressable
                    onPress={() => {
                      onSelectedItemChange(item);
                      setVisible(false);
                      setSearch('');
                    }}
                    className={cn(
                      'px-3 py-3 rounded-md flex-row justify-between items-center',
                      isSelected
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm',
                        isSelected
                          ? 'text-primary font-semibold'
                          : 'text-gray-900 dark:text-white'
                      )}
                    >
                      {item.label}
                    </Text>
                    {isSelected && <Check/>} 
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
