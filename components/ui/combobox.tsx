import React, { useState } from 'react';
import {
  View,
  Pressable,
  Modal,
  FlatList,

  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,TouchableOpacity 
} from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Check } from "@/lib/icons/Check"; 
import {Input} from "@/components/ui/input";
import FontAwesome from '@expo/vector-icons/FontAwesome';



interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  items: ComboboxOption[];
  placeholder?: string;
  selectedItem: ComboboxOption | null;
  onSelectedItemChange: (item: ComboboxOption) => void;
  disabled?: boolean;
}

export function Combobox({
  items,
  placeholder,
  selectedItem,
  onSelectedItemChange,
  disabled = false,
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
        onPress={() => {
          if (!disabled) setVisible(true);
        }}
        disabled={disabled}
        >
        <Text className="text-base text-gray-700 dark:text-white">
          {selectedItem?.label || placeholder || 'Select...'}
        </Text>
        {selectedItem?.label && <Check />}
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1 justify-center items-center px-4">
            <View className="w-full gap-2 flex max-w-md max-h-[80%] rounded-xl bg-white dark:bg-[#1E1E1E] p-4 space-y-3">
              
              <View className="relative ">
                        <Input
                          id="search"
                          placeholder="Search..."
                          className="pr-10"
                          value={search}
                          onChangeText={setSearch}
                        />
                        
                  
                        {search.length > 0 ? (
                          <TouchableOpacity
                            onPress={() => {
                              setSearch('');
                              Keyboard.dismiss();
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <FontAwesome name="times-circle" size={20} color="gray" />
                          </TouchableOpacity>
                        ) : (
                          <View className="absolute right-3 top-1/2 -translate-y-1/2">
                            <FontAwesome name="search-minus" size={20} color="gray" />
                          </View>
                        )}
                      </View>
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
                        Keyboard.dismiss();
                      
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
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
