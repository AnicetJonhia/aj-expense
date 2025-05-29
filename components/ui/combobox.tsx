import React, { useState, useRef } from 'react';
import { View, Pressable, FlatList} from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Check } from '@/lib/icons/Check';
import { Input } from '@/components/ui/input';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';

export interface ComboboxOption {
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
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<any>(null);

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: ComboboxOption) => {
    inputRef.current?.blur();
    onSelectedItemChange(item);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pressable
          className={cn(
            'border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] flex-row justify-between items-center',
            disabled && 'opacity-50'
          )}
          onPress={() => !disabled && setOpen(true)}
          disabled={disabled}
        >
          <Text className="text-base text-gray-700 dark:text-white">
            {selectedItem?.label || placeholder || 'Select...'}
          </Text>
          {selectedItem && <Check />}
        </Pressable>
      </DialogTrigger>

      <DialogContent className="w-[90vw] max-h-[50vh] gap-2 max-w-screen-md sm:max-w-screen-sm p-4">
        <View className="space-y-3 pt-10">
          <View className="relative">
            <Input
              ref={inputRef}
              placeholder="Search..."
              className="pr-10"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 ? (
              <Pressable
                onPress={() => {
                  setSearch('');
                  inputRef.current?.blur();
                }}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                  zIndex: 10,
                  padding: 4,
                }}
              >
                <Text><FontAwesome name="times-circle" size={20} color="gray" /></Text>
              </Pressable>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: [{ translateY: -10 }],
                  zIndex: 1,
                  padding: 4,
                }}
              >
                <FontAwesome name="search-minus" size={20} color="gray" />
              </View>
            )}
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={i => i.value}
          style={{ flexGrow: 0, maxHeight: 300 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSel = selectedItem?.value === item.value;
            return (
              <Pressable
                onPress={() => handleSelect(item)}
                className={cn(
                  'px-3 py-3 rounded-md flex-row justify-between items-center',
                  isSel
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <Text
                  className={cn(
                    'text-sm',
                    isSel
                      ? 'text-primary font-semibold'
                      : 'text-gray-900 dark:text-white'
                  )}
                >
                  {item.label}
                </Text>
                {isSel && <Check />}
              </Pressable>
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
