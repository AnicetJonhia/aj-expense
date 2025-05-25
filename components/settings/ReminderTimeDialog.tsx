import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Dialog, DialogContent, DialogHeader, DialogTitle ,DialogFooter} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettingsStore } from '@/store/useSettingsStore';
import {Text} from '@/components/ui/text';

interface ReminderTimeDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ReminderTimeDialog({ isOpen, setIsOpen }: ReminderTimeDialogProps) {
  const { reminderTime, setReminderTime } = useSettingsStore();
  const [hour, setHour] = useState(reminderTime.hour.toString());
  const [minute, setMinute] = useState(reminderTime.minute.toString().padStart(2, '0'));


  useEffect(() => {
    if (isOpen) {
      setHour(reminderTime.hour.toString());
      setMinute(reminderTime.minute.toString().padStart(2, '0'));
    }
  }, [isOpen, reminderTime]); 


  const handleSave = () => {
    const newHour = Math.min(23, Math.max(0, parseInt(hour) || 0));
    const newMinute = Math.min(59, Math.max(0, parseInt(minute) || 0));
    
    setReminderTime(newHour, newMinute);
    setIsOpen(false);
  };

  const handleHourChange = (text: string) => {
    const num = parseInt(text);
    if (text === '' || (num >= 0 && num <= 23)) {
      setHour(text);
    }
  };

  const handleMinuteChange = (text: string) => {
    const num = parseInt(text);
    if (text === '' || (num >= 0 && num <= 59)) {
      setMinute(text);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90vw] max-w-screen-md sm:max-w-screen-sm p-4">
        <DialogHeader>
          <DialogTitle>Set Reminder Time</DialogTitle>
        </DialogHeader>
        
        <View className="flex-row items-center justify-between gap-4 my-4">
          <View className="flex-1">
            <Label>Hour (0-23)</Label>
            <Input
              keyboardType="numeric"
              value={hour}
              onChangeText={handleHourChange}
              maxLength={2}
            />
          </View>
          
          <View className="flex-1">
            <Label>Minute (0-59)</Label>
            <Input
              keyboardType="numeric"
              value={minute}
              onChangeText={handleMinuteChange}
              maxLength={2}
            />
          </View>
        </View>
             <DialogFooter> 
                <View className="flex-row gap-2 ">
                <Button variant="outline" className='flex-1' onPress={() => setIsOpen(false)}>
                    <Text>Cancel</Text>
                </Button>
                <Button onPress={handleSave} className='flex-1'>
                    <Text>Save</Text>
                </Button>
                </View>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}