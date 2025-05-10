import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { formatDate } from '@/utils/formatDate';
import DateFilterDialog from '@/components/DateFilterDialog';

export default function Example() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>
        <Text>{selectedDate ? formatDate(selectedDate) : 'Filter'}</Text>
      </Button>

      <DateFilterDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleDateChange={handleDateChange}
      />
    </>
  );
}
