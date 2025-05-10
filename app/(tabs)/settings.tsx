import React, { useState } from 'react';
import { View, Text, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import DateFilter from '@/components/DateFilter';
import { formatDate, extractDateParts } from "@/utils/formatDate";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MainScreen() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const { year, month, day } = extractDateParts(selectedDate);

  return (
    <View className="flex-1 px-6 py-6 gap-4">
      <Pressable onPress={() => setModalVisible(true)}>
        <Text className="text-blue-600 underline">
          {selectedDate ? formatDate(selectedDate) : 'Filter'}
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center px-4">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="w-full max-w-md max-h-[80%] rounded-xl bg-white dark:bg-[#1E1E1E] p-4">
                
           
                <View className="items-end">
                  <Pressable onPress={() => setModalVisible(false)}>
                    <FontAwesome name="times-circle" size={30} color="gray" />
                  </Pressable>
                </View>

                <DateFilter onDateChange={handleDateChange} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
